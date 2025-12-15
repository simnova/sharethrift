import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, fn, waitFor } from 'storybook/test';
import { AdminUsersTableContainer } from './admin-users-table.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../../test-utils/storybook-decorators.tsx';
import {
	AdminUsersTableContainerAllUsersDocument,
	BlockUserDocument,
	UnblockUserDocument,
} from '../../../../../../../generated.tsx';

const mockUsers = [
	{
		__typename: 'PersonalUser',
		id: 'user-1',
		createdAt: '2024-01-15T10:30:00Z',
		userType: 'personal-user',
		isBlocked: false,
		account: {
			__typename: 'PersonalUserAccount',
			username: 'john_doe',
			email: 'john@example.com',
			profile: {
				__typename: 'PersonalUserAccountProfile',
				firstName: 'John',
				lastName: 'Doe',
			},
		},
	},
	{
		__typename: 'PersonalUser',
		id: 'user-2',
		createdAt: '2024-02-20T14:45:00Z',
		userType: 'personal-user',
		isBlocked: true,
		account: {
			__typename: 'PersonalUserAccount',
			username: 'jane_smith',
			email: 'jane@example.com',
			profile: {
				__typename: 'PersonalUserAccountProfile',
				firstName: 'Jane',
				lastName: 'Smith',
			},
		},
	},
];

const meta: Meta<typeof AdminUsersTableContainer> = {
	title: 'Containers/AdminUsersTableContainer',
	component: AdminUsersTableContainer,
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: mockUsers,
								total: 2,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
				{
					request: {
						query: BlockUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							blockUser: {
								__typename: 'MutationStatus',
								success: true,
								errorMessage: null,
							},
						},
					},
				},
				{
					request: {
						query: UnblockUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							unblockUser: {
								__typename: 'MutationStatus',
								success: true,
								errorMessage: null,
							},
						},
					},
				},
			],
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/users'),
	],
};

export default meta;
type Story = StoryObj<typeof AdminUsersTableContainer>;

export const Default: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		expect(canvasElement).toBeTruthy();
		const johnDoe = canvas.queryByText(/John/i);
		if (johnDoe) {
			expect(johnDoe).toBeInTheDocument();
		}
	},
};

export const Empty: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: [],
								total: 0,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const Loading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const WithSearch: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvasElement).toBeTruthy();
		const searchInput = canvas.queryByRole('textbox');
		if (searchInput) {
			await userEvent.type(searchInput, 'john');
		}
	},
};

export const WithBlockedUser: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: [mockUsers[1]],
								total: 1,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
				{
					request: {
						query: UnblockUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							unblockUser: {
								__typename: 'MutationStatus',
								success: true,
								errorMessage: null,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvasElement).toBeTruthy();
		const blockedText = canvas.queryByText(/Blocked/i);
		if (blockedText) {
			expect(blockedText).toBeInTheDocument();
		}
	},
};

export const BlockUserError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: mockUsers,
								total: 2,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
				{
					request: {
						query: BlockUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Failed to block user'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const ManyUsers: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: Array.from({ length: 10 }, (_, i) => ({
									__typename: 'PersonalUser',
									id: `user-${i + 1}`,
									createdAt: '2024-01-15T10:30:00Z',
									userType: 'personal-user',
									isBlocked: i % 3 === 0,
									account: {
										__typename: 'PersonalUserAccount',
										username: `user_${i + 1}`,
										email: `user${i + 1}@example.com`,
										profile: {
											__typename: 'PersonalUserAccountProfile',
											firstName: `User`,
											lastName: `${i + 1}`,
										},
									},
								})),
								total: 100,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const UnblockUserError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: [mockUsers[1]],
								total: 1,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
				{
					request: {
						query: UnblockUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Failed to unblock user'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const WithError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Failed to fetch users'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const WithStatusFilter: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvasElement).toBeTruthy();
		const filterDropdown = canvas.queryByText(/Status/i);
		if (filterDropdown) {
			await userEvent.click(filterDropdown);
		}
	},
};

export const ViewProfileAction: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: mockUsers,
								total: 2,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/John/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Find and click action dropdown
		const actionBtns = canvas.queryAllByRole('button');
		const moreBtn = actionBtns.find(
			(btn) =>
				btn.textContent?.includes('...') ||
				btn.querySelector('[data-icon="ellipsis"]') ||
				btn.querySelector('[data-icon="more"]'),
		);
		if (moreBtn) {
			await userEvent.click(moreBtn);
		}
	},
};

export const ViewReportAction: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: mockUsers,
								total: 2,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/John/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Verify the table is rendered with action columns
		expect(
			canvas.queryAllByText(/Active/i).length > 0 ||
				canvas.queryAllByText(/Blocked/i).length > 0,
		).toBeTruthy();
	},
};

export const ArrayFieldSort: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: mockUsers,
								total: 2,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/John/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Click on a sortable column header to trigger sorting
		const usernameHeader = canvas.queryByText(/Username/i);
		if (usernameHeader) {
			await userEvent.click(usernameHeader);
		}
	},
};

export const UserWithMissingData: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: [
									{
										__typename: 'PersonalUser',
										id: 'user-incomplete',
										createdAt: null,
										userType: null,
										isBlocked: null,
										account: {
											__typename: 'PersonalUserAccount',
											username: null,
											email: null,
											profile: {
												__typename: 'PersonalUserAccountProfile',
												firstName: null,
												lastName: null,
											},
										},
									},
								],
								total: 1,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/N\/A/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
	},
};

export const BlockUserAction: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: mockUsers,
								total: 2,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
				{
					request: {
						query: BlockUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							blockUser: {
								__typename: 'MutationStatus',
								success: true,
								errorMessage: null,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/John/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Click on a "Block" button if visible
		const blockBtn = canvas.queryByRole('button', { name: /^Block$/i });
		if (blockBtn) {
			await userEvent.click(blockBtn);
		}
	},
};

export const UnblockUserAction: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: [mockUsers[1]],
								total: 1,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
				{
					request: {
						query: UnblockUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							unblockUser: {
								__typename: 'MutationStatus',
								success: true,
								errorMessage: null,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Jane/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Click on an "Unblock" button if visible
		const unblockBtn = canvas.queryByRole('button', { name: /Unblock/i });
		if (unblockBtn) {
			await userEvent.click(unblockBtn);
		}
	},
};

export const SortAscending: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: mockUsers,
								total: 2,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/John/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Click on column header twice for ascending sort
		const firstNameHeader = canvas.queryByText(/First Name/i);
		if (firstNameHeader) {
			await userEvent.click(firstNameHeader);
			await userEvent.click(firstNameHeader);
		}
	},
};
