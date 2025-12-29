import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, within } from 'storybook/test';
import { RequestsTable } from './requests-table.tsx';
import type { ListingRequestData } from './my-listings-dashboard.types.ts';

const meta: Meta<typeof RequestsTable> = {
	title: 'Layouts/Home/MyListings/RequestsTable',
	component: RequestsTable,
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
};

export default meta;

type Story = StoryObj<typeof RequestsTable>;

const sampleData: ListingRequestData[] = [
	{
		id: 'req-1',
		title: 'Cordless Drill',
		image: '/assets/item-images/placeholder.png',
		requestedBy: '@alice',
		requestedById: '507f1f77bcf86cd799439011',
		requestedOn: '2025-01-01T00:00:00.000Z',
		reservationPeriod: '2025-01-05 - 2025-01-10',
		status: 'Pending',
	},
	{
		id: 'req-2',
		title: 'Camera',
		image: '/assets/item-images/placeholder.png',
		requestedBy: '@unknown',
		requestedById: null,
		requestedOn: '2025-01-02T00:00:00.000Z',
		reservationPeriod: 'N/A',
		status: 'Accepted',
	},
];

export const Default: Story = {
	args: {
		data: sampleData,
		searchText: '',
		statusFilters: [],
		sorter: { field: null, order: null },
		currentPage: 1,
		pageSize: 10,
		total: sampleData.length,
		loading: false,
		onSearch: () => undefined,
		onStatusFilter: () => undefined,
		onTableChange: () => undefined,
		onPageChange: () => undefined,
		onAction: () => undefined,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getAllByText('Cordless Drill').length).toBeGreaterThan(0);
		await expect(canvas.getAllByText('@alice').length).toBeGreaterThan(0);
		await expect(canvas.getAllByText('Accepted').length).toBeGreaterThan(0);
	},
};
