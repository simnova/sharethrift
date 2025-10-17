import { useState, useCallback } from 'react';
import { message, Modal } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
	AdminListingsTableContainerAdminListingsDocument,
	AdminListingsTableContainerRemoveListingDocument,
    AdminListingsTableContainerUnblockListingDocument,
} from '../../../../../../generated.tsx';
import { AdminListingsTable } from './admin-listings-table.tsx';
import { ComponentQueryLoader } from '@sthrift/ui-components';

export interface AdminListingsProps {}

export function AdminListings() {
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
				searchText,
				statusFilters,
				sorter: sorter.field && sorter.order ? { field: sorter.field, order: sorter.order } : undefined,
			},
			// Force this operation over the non-batched HTTP link to avoid servers that don't support batching
			context: { headers: { 'Cache-Enabled': 'true' } },
			fetchPolicy: 'network-only',
		},
	);

	const [removeListingMutation, { loading: removing }] = useMutation(
		AdminListingsTableContainerRemoveListingDocument,
	);

	const [unblockListingMutation, { loading: unblocking }] = useMutation(
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
		async (action: string, listingId: string) => {
					if (action === 'view') {
						window.open(`/listing/${listingId}`, '_blank');
					}
					if (action === 'unblock') {
						Modal.confirm({
							title: 'Unblock this listing?',
							content: 'This will make the listing active again.',
							okText: 'Unblock',
							okButtonProps: { loading: unblocking },
							onOk: async () => {
								try {
									const { data } = await unblockListingMutation({ variables: { id: listingId } });
									if (data?.unblockListing) {
										message.success('Listing unblocked');
										await refetch();
									} else {
										message.error('Failed to unblock listing');
									}
								} catch (e: unknown) {
									const msg = e instanceof Error ? e.message : String(e);
									message.error(msg);
								}
							},
						});
					}
			if (action === 'delete' || action === 'remove') {
				Modal.confirm({
					title: 'Remove this listing?',
					content: 'This action permanently deletes the listing.',
					okText: 'Remove',
					okButtonProps: { danger: true, loading: removing },
					onOk: async () => {
						try {
							const { data } = await removeListingMutation({ variables: { id: listingId } });
							if (data?.removeListing) {
								message.success('Listing removed');
								await refetch();
							} else {
								message.error('Failed to remove listing');
							}
						} catch (e: unknown) {
							const msg = e instanceof Error ? e.message : String(e);
							message.error(msg);
						}
					},
				});
			}
		},
		[refetch, removeListingMutation, removing, unblockListingMutation, unblocking],
	);

		// Admin dashboard doesn't open request modal yet; will be implemented later

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
					sorter={sorter}
					currentPage={page}
					pageSize={pageSize}
					total={total}
					onSearch={onSearch}
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

