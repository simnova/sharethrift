import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, fn, userEvent } from 'storybook/test';
import { AdminUsersCard } from '../admin-users-card.tsx';
import type { AdminUserData } from '../admin-users-table.types.ts';

const mockActiveUser: AdminUserData = {
	id: 'user-1',
	username: 'johndoe',
	firstName: 'John',
	lastName: 'Doe',
	email: 'john.doe@example.com',
	status: 'Active',
	accountCreated: '2024-01-15T10:30:00Z',
	reportCount: 0,
	isBlocked: false,
};

const mockBlockedUser: AdminUserData = {
	id: 'user-2',
	username: 'blockeduser',
	firstName: 'Jane',
	lastName: 'Smith',
	email: 'jane.smith@example.com',
	status: 'Blocked',
	accountCreated: '2023-06-20T14:00:00Z',
	reportCount: 3,
	isBlocked: true,
};

const mockUserWithReports: AdminUserData = {
	id: 'user-3',
	username: 'reporteduser',
	firstName: 'Bob',
	lastName: 'Wilson',
	email: 'bob@example.com',
	status: 'Active',
	accountCreated: '2024-03-10T09:00:00Z',
	reportCount: 5,
	isBlocked: false,
};

const mockUserNoDate: AdminUserData = {
	id: 'user-4',
	username: 'newuser',
	firstName: 'Alice',
	lastName: 'Brown',
	status: 'Active',
	reportCount: 0,
	accountCreated: '',
	isBlocked: false,
};

const meta: Meta<typeof AdminUsersCard> = {
	title: 'Admin/UsersTable/AdminUsersCard',
	component: AdminUsersCard,
	parameters: {
		layout: 'centered',
	},
	args: {
		onAction: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof AdminUsersCard>;

export const ActiveUser: Story = {
	args: {
		user: mockActiveUser,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText('johndoe')).toBeTruthy();
		expect(canvas.getByText('Active')).toBeTruthy();
		expect(canvas.getByText('View Profile')).toBeTruthy();
		expect(canvas.getByText('Block')).toBeTruthy();
		expect(canvas.queryByText('Unblock')).toBeNull();
	},
};

export const BlockedUser: Story = {
	args: {
		user: mockBlockedUser,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText('blockeduser')).toBeTruthy();
		expect(canvas.getByText('Blocked')).toBeTruthy();
		expect(canvas.getByText('Unblock')).toBeTruthy();
		expect(canvas.queryByText('Block')).toBeNull();
	},
};

export const UserWithReports: Story = {
	args: {
		user: mockUserWithReports,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText('reporteduser')).toBeTruthy();
		expect(canvas.getByText('View Report (5)')).toBeTruthy();
	},
};

export const UserWithNoDate: Story = {
	args: {
		user: mockUserNoDate,
	},
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText('newuser')).toBeTruthy();
		expect(canvasElement.textContent).toContain('N/A');
	},
};

export const ClickViewProfile: Story = {
	args: {
		user: mockActiveUser,
		onAction: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const viewProfileBtn = canvas.getByText('View Profile');
		await userEvent.click(viewProfileBtn);
		expect(args.onAction).toHaveBeenCalledWith('view-profile');
	},
};

export const ClickBlock: Story = {
	args: {
		user: mockActiveUser,
		onAction: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const blockBtn = canvas.getByText('Block');
		await userEvent.click(blockBtn);
		expect(args.onAction).toHaveBeenCalledWith('block');
	},
};

export const ClickUnblock: Story = {
	args: {
		user: mockBlockedUser,
		onAction: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const unblockBtn = canvas.getByText('Unblock');
		await userEvent.click(unblockBtn);
		expect(args.onAction).toHaveBeenCalledWith('unblock');
	},
};

export const ClickViewReport: Story = {
	args: {
		user: mockUserWithReports,
		onAction: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const viewReportBtn = canvas.getByText('View Report (5)');
		await userEvent.click(viewReportBtn);
		expect(args.onAction).toHaveBeenCalledWith('view-report');
	},
};
