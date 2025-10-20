import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
	AdminListingsTableContainerAdminListingsDocument,
	AdminListingsTableContainerRemoveListingDocument,
    AdminListingsTableContainerUnblockListingDocument,
} from '../../../../../../generated.tsx';
import { AdminListingsTable } from './admin-listings-table.tsx';
import { ComponentQueryLoader } from '@sthrift/ui-components';

export function AdminListings() {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const pageSize = 6;
	const [searchText, setSearchText] = useState('');
	const [statusFilters, setStatusFilters] = useState<string[]>(['Appeal Requested', 'Blocked']);
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
				sorter: sorter.field && sorter.order ? { field: sorter.field, order: sorter.order } : undefined,
			},
			// Force this operation over the non-batched HTTP link to avoid servers that don't support batching
			context: { headers: { 'Cache-Enabled': 'true' } },
			fetchPolicy: 'network-only',
		},
	);

	const [removeListingMutation] = useMutation(
		AdminListingsTableContainerRemoveListingDocument,
	);

	const [unblockListingMutation] = useMutation(
		AdminListingsTableContainerUnblockListingDocument,
	);

	const listings = data?.adminListings?.items ?? [];
	const total = data?.adminListings?.total ?? 0;

	const onSearch = useCallback((value: string) => {
		setSearchText(value);
		setPage(1);
	}, []);

	const onStatusFilter = useCallback((checked: string[]) => {
		setStatusFilters(checked);
		setPage(1);
	}, []);

		const onTableChange = useCallback((
			_pagination: unknown,
			_filters: unknown,
			s: unknown,
		) => {
			const typed = s as { field?: string; order?: 'ascend' | 'descend' };
		setSorter({ field: typed.field ?? null, order: typed.order ?? null });
		setPage(1);
	}, []);

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
				(async () => {
					try {
						await removeListingMutation({ variables: { id: listingId } });
						message.success('Listing removed');
						refetch();
					} catch (e: unknown) {
						const msg = e instanceof Error ? e.message : String(e);
						message.error(msg);
					}
				})();
			}
		},
		[refetch, removeListingMutation, unblockListingMutation],
	);

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data?.adminListings}
			hasDataComponent={
				<AdminListingsTable
					data={listings}
					searchText={searchText}
					statusFilters={statusFilters}
					onSearch={onSearch}
					sorter={sorter}
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

