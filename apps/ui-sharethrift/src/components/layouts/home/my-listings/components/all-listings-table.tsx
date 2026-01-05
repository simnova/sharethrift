import { Dashboard } from '@sthrift/ui-components';
import type { TableProps } from 'antd';
import type React from 'react';

import type { HomeAllListingsTableContainerListingFieldsFragment } from '../../../../../generated.tsx';
import { AllListingsTableActions } from './AllListingsTableActions.tsx';
import {
	ListingTitleFilterDropdown,
	ListingTitleFilterIcon,
	StatusFilterDropdown,
	StatusFilterIcon,
} from './AllListingsTableHeader.tsx';
import {
	AllListingsTableListingCell,
	AllListingsTablePendingRequestsCell,
	AllListingsTablePublishedAtCell,
	AllListingsTableReservationPeriodCell,
} from './AllListingsTableRow.tsx';
import { AllListingsTableStatus } from './AllListingsTableStatus.tsx';
import { AllListingsCard } from './all-listings-card.tsx';

interface AllListingsTableProps {
	data: HomeAllListingsTableContainerListingFieldsFragment[];
	searchText: string;
	statusFilters: string[];
	sorter: { field: string | null; order: 'ascend' | 'descend' | null };
	currentPage: number;
	pageSize: number;
	total: number;
	loading?: boolean;
	onSearch: (value: string) => void;
	onStatusFilter: (checkedValues: string[]) => void;
	onTableChange: TableProps<HomeAllListingsTableContainerListingFieldsFragment>['onChange'];
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
	const columns: TableProps<HomeAllListingsTableContainerListingFieldsFragment>['columns'] =
		[
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
