import { Dashboard } from '@sthrift/ui-components';
import type { TableProps } from 'antd';
import type React from 'react';

import type { HomeAllListingsTableContainerListingFieldsFragment } from '../../../../../generated.tsx';
import { AllListingsTableActions } from './AllListingsTableActions.tsx';
import { ListingTitleFilterDropdown } from './all-listings-table-header';
import { ListingTitleFilterIcon } from './listing-title-filter-icon';
import { StatusFilterDropdown } from './status-filter-dropdown';
import { StatusFilterIcon } from './status-filter-icon';
import {
	AllListingsTableListingCell,
	AllListingsTablePendingRequestsCell,
	AllListingsTablePublishedAtCell,
	AllListingsTableReservationPeriodCell,
} from './AllListingsTableRow.tsx';
import { AllListingsTableStatus } from './AllListingsTableStatus.tsx';
import { AllListingsCard } from './all-listings-card.tsx';

/**
 * AllListingsTableProps expects data to be already sorted, filtered, and paginated by the backend.
 * UI state (searchText, statusFilters, sorter, currentPage, pageSize) is only used to trigger backend fetches.
 * The backend response must include the correct page of data and total count for pagination.
 */
interface AllListingsTableProps {
	/**
	 * Data for the current page, already sorted/filtered/paginated by the backend.
	 */
	data: HomeAllListingsTableContainerListingFieldsFragment[];
	/**
	 * Current search text (for UI control only, not for local filtering).
	 */
	searchText: string;
	/**
	 * Current status filters (for UI control only, not for local filtering).
	 */
	statusFilters: string[];
	/**
	 * Current sorter (for UI control only, not for local sorting).
	 */
	sorter: { field: string | null; order: 'ascend' | 'descend' | null };
	/**
	 * Current page number (1-based).
	 */
	currentPage: number;
	/**
	 * Page size (number of items per page).
	 */
	pageSize: number;
	/**
	 * Total number of items (for pagination UI).
	 */
	total: number;
	loading?: boolean;
	/**
	 * Triggers backend fetch for search.
	 */
	onSearch: (value: string) => void;
	/**
	 * Triggers backend fetch for status filter.
	 */
	onStatusFilter: (checkedValues: string[]) => void;
	/**
	 * Triggers backend fetch for sort/pagination/filter changes.
	 */
	onTableChange: TableProps<HomeAllListingsTableContainerListingFieldsFragment>['onChange'];
	/**
	 * Triggers backend fetch for page change.
	 */
	onPageChange: (page: number) => void;
	onAction: (action: string, listingId: string) => void;
	onViewAllRequests: (listingId: string) => void;
}

export const AllListingsTable: React.FC<AllListingsTableProps> = ({
	data,
	searchText,
	statusFilters,
	sorter,
	currentPage,
	pageSize,
	total,
	loading = false,
	onSearch,
	onStatusFilter,
	onTableChange,
	onPageChange,
	onAction,
	onViewAllRequests,
}) => {
	// All sorting, filtering, and pagination must be handled by the backend.
	// The columns below only trigger backend fetches via the provided handlers.
	const columns: TableProps<HomeAllListingsTableContainerListingFieldsFragment>['columns'] = [
			{
				title: 'Listing',
				dataIndex: 'title',
				key: 'title',
				width: 300,
				filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) =>
					ListingTitleFilterDropdown({
						onSearch,
						searchText,
						setSelectedKeys,
						selectedKeys,
						confirm,
					}),
				filterIcon: (filtered: boolean) => ListingTitleFilterIcon({ filtered }),
				render: (
					title: string,
					record: HomeAllListingsTableContainerListingFieldsFragment,
				) => (
					<AllListingsTableListingCell
						title={title}
						imageSrc={record.images?.[0] ?? ''}
					/>
				),
			},
			{
				title: 'Published At',
				dataIndex: 'createdAt',
				key: 'createdAt',
				sorter: true,
				sortOrder: sorter.field === 'createdAt' ? sorter.order : null,
				render: (date?: string) => (
					<AllListingsTablePublishedAtCell date={date} />
				),
			},
			{
				title: 'Reservation Period',
				key: 'reservationPeriod',
				sorter: true,
				sortOrder: sorter.field === 'reservationPeriod' ? sorter.order : null,
				render: (
					_: unknown,
					record: HomeAllListingsTableContainerListingFieldsFragment,
				) => (
					<AllListingsTableReservationPeriodCell
						startDate={record.sharingPeriodStart}
						endDate={record.sharingPeriodEnd}
					/>
				),
			},
			{
				title: 'Status',
				dataIndex: 'state',
				key: 'state',
				filterDropdown: ({ confirm }) =>
					StatusFilterDropdown({ statusFilters, onStatusFilter, confirm }),
				filterIcon: (filtered: boolean) => StatusFilterIcon({ filtered }),
				render: (status: string) => <AllListingsTableStatus status={status} />,
			},
			{
				title: 'Actions',
				key: 'actions',
				width: 200,
				render: (
					_: unknown,
					record: HomeAllListingsTableContainerListingFieldsFragment,
				) => {
					return (
						<AllListingsTableActions record={record} onAction={onAction} />
					);
				},
			},
			{
				title: 'Pending Requests',
				key: 'pendingRequestsCount',
				sorter: true,
				sortOrder:
					sorter.field === 'pendingRequestsCount' ? sorter.order : null,
				render: (
					_: unknown,
					record: HomeAllListingsTableContainerListingFieldsFragment,
				) => {
					const count = 0;
					return (
						<AllListingsTablePendingRequestsCell
							count={count}
							listingId={record.id}
							onViewAllRequests={onViewAllRequests}
						/>
					);
				},
			},
		];

	return (
		<Dashboard
			data={data}
			columns={columns}
			loading={loading}
			currentPage={currentPage}
			pageSize={pageSize}
			total={total}
			onPageChange={onPageChange}
			showPagination={true}
			onChange={onTableChange}
			renderGridItem={(item) => (
				<AllListingsCard
					listing={item}
					onViewPendingRequests={onViewAllRequests}
					onAction={onAction}
				/>
			)}
		/>
	);
};
