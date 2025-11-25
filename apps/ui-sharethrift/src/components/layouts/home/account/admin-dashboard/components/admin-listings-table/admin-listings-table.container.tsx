import { useMutation, useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { message } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	AdminListingsTableContainerAdminListingsDocument,
	AdminListingsTableContainerDeleteListingDocument,
	AdminListingsTableContainerUnblockListingDocument,
} from '../../../../../../../generated.tsx';
import { AdminListingsTable } from './admin-listings-table.tsx';

export function AdminListings(): React.JSX.Element {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const pageSize = 6;
	const [searchText, setSearchText] = useState('');
	const [statusFilters, setStatusFilters] = useState<string[]>([
		'Appeal Requested',
		'Blocked',
	]);
	const [sorter, setSorter] = useState<{
		field: string | null;
		order: 'ascend' | 'descend' | null;
	}>({ field: null, order: null });

	const { data, loading, error, refetch } = useQuery(
		AdminListingsTableContainerAdminListingsDocument,
		{
			variables: {
				page,
				pageSize,
				searchText: searchText || undefined,
				statusFilters,
				sorter:
					sorter.field && sorter.order
						? { field: sorter.field, order: sorter.order }
						: undefined,
			},
			// Force this operation over the non-batched HTTP link to avoid servers that don't support batching
			context: { headers: { 'Cache-Enabled': 'true' } },
			fetchPolicy: 'network-only',
		},
	);

	const [deleteListingMutation] = useMutation(
		AdminListingsTableContainerDeleteListingDocument,
		{
			onCompleted: (data) => {
				if (data.deleteItemListing?.status?.success) {
					message.success('Listing deleted successfully');
					refetch();
				} else {
					message.error(
						`Failed to delete listing: ${data.deleteItemListing?.status?.errorMessage ?? 'Unknown error'}`,
					);
				}
			},
			onError: (error) => {
				message.error(`Failed to delete listing: ${error.message}`);
			},
		},
	);

	const [unblockListingMutation] = useMutation(
		AdminListingsTableContainerUnblockListingDocument,
	);

	const listings = data?.adminListings?.items ?? [];
	const total = data?.adminListings?.total ?? 0;

	// Transform domain fields to UI format
	const transformedListings = listings.map((listing) => {
		const startDate = listing.sharingPeriodStart ?? '';
		const endDate = listing.sharingPeriodEnd ?? '';
		const reservationPeriod =
			startDate && endDate
				? `${startDate.slice(0, 10)} - ${endDate.slice(0, 10)}`
				: '';

		return {
			id: listing.id,
			title: listing.title,
			image: listing.images?.[0] ?? null,
			publishedAt: listing.createdAt ?? null,
			reservationPeriod,
			status: listing.state ?? 'Unknown',
			pendingRequestsCount: 0, // TODO: implement in future
		};
	});

	const onSearch = useCallback((value: string) => {
		setSearchText(value);
		setPage(1);
	}, []);

	const onStatusFilter = useCallback((checked: string[]) => {
		setStatusFilters(checked);
		setPage(1);
	}, []);

	const onTableChange = useCallback(
		(_pagination: unknown, _filters: unknown, s: unknown) => {
			const typed = s as { field?: string; order?: 'ascend' | 'descend' };
			setSorter({ field: typed.field ?? null, order: typed.order ?? null });
			setPage(1);
		},
		[],
	);

	const onAction = useCallback(
		(action: string, listingId: string) => {
			if (action === 'view') {
				// Navigate in same tab with admin context stored for back navigation
				globalThis.sessionStorage.setItem('adminContext', 'true');
				navigate(`/listing/${listingId}`);
			}

			if (action === 'unblock') {
				(async () => {
					try {
						await unblockListingMutation({ variables: { id: listingId } });
						message.success('Listing unblocked');
						refetch();
					} catch (e: unknown) {
						const msg = e instanceof Error ? e.message : String(e);
						message.error(msg);
					}
				})();
			}

			if (action === 'delete' || action === 'remove') {
				// Confirmation already handled by Popconfirm in the table
				// onCompleted and onError handlers will show messages
				deleteListingMutation({ variables: { id: listingId } });
			}
		},
		[refetch, deleteListingMutation, unblockListingMutation, navigate],
	);
	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data?.adminListings}
			hasDataComponent={
				<AdminListingsTable
					data={transformedListings}
					searchText={searchText}
					statusFilters={statusFilters}
					onSearch={onSearch}
					sorter={sorter ?? { field: null, order: null }}
					currentPage={page}
					pageSize={pageSize}
					total={total}
					onStatusFilter={onStatusFilter}
					onTableChange={onTableChange}
					onPageChange={setPage}
					onAction={onAction}
					loading={loading}
				/>
			}
		/>
	);
}
