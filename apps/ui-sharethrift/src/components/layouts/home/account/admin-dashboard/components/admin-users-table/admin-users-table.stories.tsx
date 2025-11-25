import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { AdminUsersTable } from './admin-users-table';
import type { AdminUserData } from './admin-users-table.types';

const mockUsers: AdminUserData[] = [
	{
		id: '1',
		username: 'johndoe',
		firstName: 'John',
		lastName: 'Doe',
		accountCreated: '2023-01-15',
		status: 'Active',
		isBlocked: false,
	},
];

const meta: Meta<typeof AdminUsersTable> = {
	title: 'Components/AdminUsersTable',
	component: AdminUsersTable,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof AdminUsersTable>;

export const WithUsers: Story = {
	args: {
		data: mockUsers,
		searchText: '',
		statusFilters: [],
		sorter: { field: null, order: null },
		currentPage: 1,
		pageSize: 10,
		total: 1,
		loading: false,
		onSearch: fn(),
		onStatusFilter: fn(),
		onTableChange: fn(),
		onPageChange: fn(),
		onAction: fn(),
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
