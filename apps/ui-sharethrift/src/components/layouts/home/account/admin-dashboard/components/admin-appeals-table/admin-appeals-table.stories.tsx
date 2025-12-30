import type { Meta, StoryObj } from '@storybook/react';
import { AdminAppealsTable } from './admin-appeals-table';
import type { AdminAppealData } from './admin-appeals-table.types';

const meta = {
	title:
		'Layouts/Home/Account/AdminDashboard/Components/AdminAppealsTable',
	component: AdminAppealsTable,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof AdminAppealsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAppeals: AdminAppealData[] = [
	{
		id: '1',
		userId: 'user1',
		userName: 'John Doe',
		userEmail: 'john.doe@example.com',
		reason:
			'I believe my account was blocked by mistake. I have always followed the community guidelines.',
		state: 'requested',
		type: 'user',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: '2',
		userId: 'user2',
		userName: 'Jane Smith',
		userEmail: 'jane.smith@example.com',
		reason:
			'I apologize for the late return. There was a family emergency.',
		state: 'accepted',
		type: 'user',
		createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '3',
		userId: 'user3',
		userName: 'Bob Johnson',
		userEmail: 'bob.johnson@example.com',
		reason: 'I disagree with the block decision.',
		state: 'denied',
		type: 'user',
		createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: '4',
		userId: 'user4',
		userName: 'Alice Williams',
		userEmail: 'alice.williams@example.com',
		reason:
			'My listing was blocked unfairly. I have updated it according to the guidelines.',
		state: 'requested',
		type: 'listing',
		createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
	},
];

export const Default: Story = {
	args: {
		data: mockAppeals,
		searchText: '',
		statusFilters: [],
		currentPage: 1,
		pageSize: 10,
		total: mockAppeals.length,
		loading: false,
		onSearch: (text: string) => console.log('Search:', text),
		onStatusFilter: (filters: string[]) => console.log('Filter:', filters),
		onTableChange: (pagination, filters, sorter) =>
			console.log('Table change:', { pagination, filters, sorter }),
		onPageChange: (page, pageSize) =>
			console.log('Page change:', { page, pageSize }),
		onAction: (action, appealId) =>
			console.log('Action:', { action, appealId }),
	},
};

export const WithPendingAppeals: Story = {
	args: {
		...Default.args,
		data: mockAppeals.filter((a) => a.state === 'requested'),
		statusFilters: ['requested'],
	},
};

export const WithAcceptedAppeals: Story = {
	args: {
		...Default.args,
		data: mockAppeals.filter((a) => a.state === 'accepted'),
		statusFilters: ['accepted'],
	},
};

export const Empty: Story = {
	args: {
		...Default.args,
		data: [],
		total: 0,
	},
};

export const Loading: Story = {
	args: {
		...Default.args,
		loading: true,
	},
};
