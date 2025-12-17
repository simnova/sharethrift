import type { Meta, StoryObj } from '@storybook/react';
import { RequestsTable } from '../components/requests-table.tsx';

const MOCK_REQUESTS = [
	{
		id: '1',
		title: 'Cordless Drill',
		image: '/assets/item-images/projector.png',
		requestedOn: '2025-12-23',
		reservationPeriod: '2020-11-08 - 2020-12-23',
		status: 'Requested',
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
	{
		id: '3',
		title: 'Camping Tent',
		image: '/assets/item-images/tent.png',
		requestedOn: '2025-07-15',
		reservationPeriod: '2025-08-01 - 2025-08-15',
		status: 'Rejected',
		requestedBy: 'Bob Wilson',
	},
	{
		id: '4',
		title: 'Projector',
		image: '/assets/item-images/projector.png',
		requestedOn: '2025-06-10',
		reservationPeriod: '2025-07-01 - 2025-07-31',
		status: 'Closed',
		requestedBy: 'Alice Johnson',
	},
	{
		id: '5',
		title: 'Ladder',
		image: '/assets/item-images/ladder.png',
		requestedOn: '2025-05-20',
		reservationPeriod: '2025-06-01 - 2025-06-15',
		status: 'Expired',
		requestedBy: 'Charlie Brown',
	},
];

const meta: Meta<typeof RequestsTable> = {
	title: 'My Listings/Requests Table',
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
		onAccept: async (requestId: string) => console.log('Accept:', requestId),
		onReject: (requestId: string) => console.log('Reject:', requestId),
		onClose: (requestId: string) => console.log('Close:', requestId),
		onDelete: (requestId: string) => console.log('Delete:', requestId),
		onMessage: (requestId: string) => console.log('Message:', requestId),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
