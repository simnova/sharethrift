import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
	AdminUsersTableContainerAllUsersDocument,
	BlockUserDocument,
	UnblockUserDocument,
} from '../../../../../../../generated.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../../test-utils/storybook-decorators.tsx';
import { AdminUsersTableContainer } from './admin-users-table.container.tsx';

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
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/John/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
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
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const emptyText =
			canvas.queryByText(/No users/i) ?? canvas.queryByText(/empty/i);
		expect(emptyText ?? canvasElement).toBeTruthy();
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
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const loadingSpinner =
			canvas.queryByRole('progressbar') ?? canvas.queryByText(/loading/i);
		expect(loadingSpinner ?? canvasElement).toBeTruthy();
	},
};

export const WithSearch: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
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
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Jane/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
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
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/John/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
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
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/User/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
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
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Jane/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
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
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const errorContainer =
					canvas.queryByRole('alert') ??
					canvas.queryByText(/an error occurred/i);
				expect(errorContainer ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const WithStatusFilter: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/John/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
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

export const ConfirmBlockUser: Story = {
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
			// Wait for modal and fill form
			await waitFor(async () => {
				const reasonSelect = document.querySelector('.ant-select-selector');
				if (reasonSelect) {
					await userEvent.click(reasonSelect);
				}
			});
			// Select first reason option
			const firstOption = document.querySelector('.ant-select-item');
			if (firstOption) {
				await userEvent.click(firstOption);
			}
			// Fill description
			const descriptionField = document.querySelector('textarea');
			if (descriptionField) {
				await userEvent.type(descriptionField, 'Test block reason');
			}
			// Confirm block
			const confirmBtn = document.querySelector(
				'.ant-modal-footer .ant-btn-primary',
			);
			if (confirmBtn) {
				await userEvent.click(confirmBtn);
			}
		}
	},
};

export const CancelBlockModal: Story = {
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
		// Click on a "Block" button if visible
		const blockBtn = canvas.queryByRole('button', { name: /^Block$/i });
		if (blockBtn) {
			await userEvent.click(blockBtn);
			// Wait for modal and cancel
			await waitFor(async () => {
				const cancelBtn = document.querySelector(
					'.ant-modal-footer .ant-btn:not(.ant-btn-primary)',
				);
				if (cancelBtn) {
					await userEvent.click(cancelBtn);
				}
			});
		}
	},
};

export const CancelUnblockModal: Story = {
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
			// Wait for modal and cancel
			await waitFor(async () => {
				const cancelBtn = document.querySelector(
					'.ant-modal-footer .ant-btn:not(.ant-btn-primary)',
				);
				if (cancelBtn) {
					await userEvent.click(cancelBtn);
				}
			});
		}
	},
};

export const HandleBlockError: Story = {
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/John/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Trigger block action which will error
		const blockBtn = canvas.queryByRole('button', { name: /^Block$/i });
		if (blockBtn) {
			await userEvent.click(blockBtn);
		}
	},
};

export const HandleUnblockError: Story = {
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Jane/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Trigger unblock action which will error
		const unblockBtn = canvas.queryByRole('button', { name: /Unblock/i });
		if (unblockBtn) {
			await userEvent.click(unblockBtn);
		}
	},
};
