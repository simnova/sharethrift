import type { Meta, StoryObj } from '@storybook/react';
import { RequestsTable } from '../components/requests-table.tsx';

const MOCK_REQUESTS = [
	{
		id: '1',
		title: 'Cordless Drill',
		image: '/assets/item-images/projector.png',
		requestedOn: '2025-12-23',
		reservationPeriod: '2020-11-08 - 2020-12-23',
		status: 'Pending',
		requestedBy: 'John Doe',
	},
	{
		id: '2',
		title: 'Electric Guitar',
		image: '/assets/item-images/projector.png',
		requestedOn: '2025-08-30',
		reservationPeriod: '2025-09-01 - 2025-09-30',
		status: 'Accepted',
		requestedBy: 'Jane Smith',
	},
];

const meta: Meta<typeof RequestsTable> = {
	title: 'Components/My Listings/Requests Table',
	component: RequestsTable,
	args: {
		data: MOCK_REQUESTS,
		searchText: '',
		statusFilters: [],
		sorter: { field: null, order: null },
		currentPage: 1,
		pageSize: 6,
		total: MOCK_REQUESTS.length,
		onSearch: (value: string) => console.log('Search:', value),
		onStatusFilter: (values: string[]) => console.log('Status filter:', values),
		onTableChange: (pagination, filters, sorter, extra) => {
			let normalizedSorter = sorter;
			if (Array.isArray(sorter)) {
				normalizedSorter = sorter[0] || { field: undefined, order: null };
			}
			console.log('Table change:', {
				pagination,
				filters,
				sorter: normalizedSorter,
				extra,
			});
		},
		onPageChange: (page: number) => console.log('Page change:', page),
		onAction: (action: string, requestId: string) =>
			console.log('Action:', action, 'Request:', requestId),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
