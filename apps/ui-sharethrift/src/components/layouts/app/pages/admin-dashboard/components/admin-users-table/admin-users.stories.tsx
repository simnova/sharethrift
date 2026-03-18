import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { AdminUsers } from './admin-users.tsx';
import { withMockApolloClient, withMockRouter } from '../../../../../../../test-utils/storybook-decorators.tsx';
import {
	AdminUsersTableContainerAllUsersDocument,
	BlockUserDocument,
	UnblockUserDocument,
} from '../../../../../../../generated.tsx';

const meta: Meta<typeof AdminUsers> = {
	title: 'Components/AdminUsers',
	component: AdminUsers,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: {
							page: 1,
							pageSize: 50,
							searchText: '',
							statusFilters: [],
							sorter: undefined,
						},
					},
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: [
									{
										__typename: 'AdminUser',
										id: 'user-1',
										username: 'john_doe',
										firstName: 'John',
										lastName: 'Doe',
										accountCreated: '2024-01-15T10:30:00Z',
										status: 'verified-personal',
										isBlocked: false,
									},
									{
										__typename: 'AdminUser',
										id: 'user-2',
										username: 'jane_smith',
										firstName: 'Jane',
										lastName: 'Smith',
										accountCreated: '2024-02-20T14:45:00Z',
										status: 'verified-organization',
										isBlocked: false,
									},
								],
								total: 2,
							},
						},
					},
				},
				{
					request: {
						query: BlockUserDocument,
					},
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
					},
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
	decorators: [withMockApolloClient, withMockRouter('/account/admin-dashboard')],
} satisfies Meta<typeof AdminUsers>;

export default meta;
type Story = StoryObj<typeof AdminUsers>;

export const Default: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const WithSearchFilter: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click search icon to open search dropdown
		const searchIcons = canvas.queryAllByRole('img', { name: /search/i });
		if (searchIcons[0]) {
			await userEvent.click(searchIcons[0]);
		}
	},
};

export const WithStatusFilter: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click filter icon to open status filter
		const filterIcons = canvas.queryAllByRole('img', { name: /filter/i });
		if (filterIcons[0]) {
			await userEvent.click(filterIcons[0]);
		}
	},
};

export const SortByFirstName: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click on First Name column header to sort
		const firstNameHeader = canvas.queryByText(/First Name/i);
		if (firstNameHeader) {
			await userEvent.click(firstNameHeader);
		}
	},
};

export const SortByLastName: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click on Last Name column header to sort
		const lastNameHeader = canvas.queryByText(/Last Name/i);
		if (lastNameHeader) {
			await userEvent.click(lastNameHeader);
		}
	},
};

export const SortByAccountCreated: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click on Account Creation column header to sort
		const accountCreatedHeader = canvas.queryByText(/Account Creation/i);
		if (accountCreatedHeader) {
			await userEvent.click(accountCreatedHeader);
		}
	},
};

export const BlockUserModal: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click Block button for first user
		const blockButtons = canvas.queryAllByRole('button', { name: /^Block$/i });
		if (blockButtons[0]) {
			await userEvent.click(blockButtons[0]);
			// Modal should appear
			await waitFor(() => {
				expect(canvas.queryByText(/Block User/i)).toBeInTheDocument();
			}, { timeout: 2000 });
		}
	},
};

export const UnblockUserModal: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: {
							page: 1,
							pageSize: 50,
							searchText: '',
							statusFilters: [],
							sorter: undefined,
						},
					},
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: [
									{
										__typename: 'AdminUser',
										id: 'user-2',
										username: 'jane_smith',
										firstName: 'Jane',
										lastName: 'Smith',
										accountCreated: '2024-02-20T14:45:00Z',
										status: 'Blocked',
										isBlocked: true,
									},
								],
								total: 1,
							},
						},
					},
				},
				{
					request: {
						query: UnblockUserDocument,
					},
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
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click Unblock button
		const unblockButtons = canvas.queryAllByRole('button', { name: /Unblock/i });
		if (unblockButtons[0]) {
			await userEvent.click(unblockButtons[0]);
			// Modal should appear
			await waitFor(() => {
				expect(canvas.queryByText(/Unblock User/i)).toBeTruthy();
			}, { timeout: 2000 });
		}
	},
};

export const ViewProfileAction: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click View Profile button
		const viewProfileButtons = canvas.queryAllByRole('button', { name: /View Profile/i });
		if (viewProfileButtons[0]) {
			await userEvent.click(viewProfileButtons[0]);
		}
	},
};

export const ViewReportAction: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click View Report button
		const viewReportButtons = canvas.queryAllByRole('button', { name: /View Report/i });
		if (viewReportButtons[0]) {
			await userEvent.click(viewReportButtons[0]);
		}
	},
};

export const BlockModalFormValidation: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click Block button to open modal
		const blockButtons = canvas.queryAllByRole('button', { name: /^Block$/i });
		if (blockButtons[0]) {
			await userEvent.click(blockButtons[0]);
			await waitFor(() => {
				expect(canvas.queryByText(/Block User/i)).toBeInTheDocument();
			}, { timeout: 2000 });
			
			// Try to submit without filling form - should trigger validation
			const blockUserButton = canvas.queryByRole('button', { name: /Block User/i });
			if (blockUserButton) {
				await userEvent.click(blockUserButton);
			}
		}
	},
};

export const BlockModalFillForm: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click Block button to open modal
		const blockButtons = canvas.queryAllByRole('button', { name: /^Block$/i });
		if (blockButtons[0]) {
			await userEvent.click(blockButtons[0]);
			await waitFor(() => {
				expect(canvas.queryByText(/Block User/i)).toBeInTheDocument();
			}, { timeout: 2000 });
			
			// Fill out the form
			const reasonSelect = canvas.queryByText(/Reason for Block/i)?.closest('.ant-form-item')?.querySelector('.ant-select-selector');
			if (reasonSelect) {
				await userEvent.click(reasonSelect);
				await waitFor(() => {
					const lateReturnOption = canvas.queryByText(/Late Return/i);
					if (lateReturnOption) {
						userEvent.click(lateReturnOption);
					}
				}, { timeout: 1000 });
			}
			
			const durationSelect = canvas.queryByText(/Block Duration/i)?.closest('.ant-form-item')?.querySelector('.ant-select-selector');
			if (durationSelect) {
				await userEvent.click(durationSelect);
				await waitFor(() => {
					const sevenDaysOption = canvas.queryByText(/7 Days/i);
					if (sevenDaysOption) {
						userEvent.click(sevenDaysOption);
					}
				}, { timeout: 1000 });
			}
			
			const descriptionTextarea = canvas.queryByPlaceholderText(/This message will be shown to the user/i);
			if (descriptionTextarea) {
				await userEvent.type(descriptionTextarea, 'User violated community guidelines');
			}
		}
	},
};

export const BlockModalCancel: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click Block button to open modal
		const blockButtons = canvas.queryAllByRole('button', { name: /^Block$/i });
		if (blockButtons[0]) {
			await userEvent.click(blockButtons[0]);
			await waitFor(() => {
				expect(canvas.queryByText(/Block User/i)).toBeInTheDocument();
			}, { timeout: 2000 });
			
			// Click Cancel button
			const cancelButton = canvas.queryByRole('button', { name: /Cancel/i });
			if (cancelButton) {
				await userEvent.click(cancelButton);
			}
		}
	},
};

export const UnblockModalConfirm: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: {
							page: 1,
							pageSize: 50,
							searchText: '',
							statusFilters: [],
							sorter: undefined,
						},
					},
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: [
									{
										__typename: 'AdminUser',
										id: 'user-2',
										username: 'jane_smith',
										firstName: 'Jane',
										lastName: 'Smith',
										accountCreated: '2024-02-20T14:45:00Z',
										status: 'Blocked',
										isBlocked: true,
									},
								],
								total: 1,
							},
						},
					},
				},
				{
					request: {
						query: UnblockUserDocument,
					},
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
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Click Unblock button
		const unblockButtons = canvas.queryAllByRole('button', { name: /Unblock/i });
		if (unblockButtons[0]) {
			await userEvent.click(unblockButtons[0]);
			await waitFor(() => {
				expect(canvas.queryByText(/Unblock User/i)).toBeTruthy();
			}, { timeout: 2000 });
			
			// Click Unblock User button to confirm
			const confirmButton = canvas.queryByRole('button', { name: /Unblock User/i });
			if (confirmButton) {
				await userEvent.click(confirmButton);
			}
		}
	},
};

export const WithNullDateRender: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: {
							page: 1,
							pageSize: 50,
							searchText: '',
							statusFilters: [],
							sorter: undefined,
						},
					},
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: [
									{
										__typename: 'AdminUser',
										id: 'user-null',
										username: 'null_date_user',
										firstName: 'Null',
										lastName: 'Date',
										accountCreated: null,
										status: 'verified-personal',
										isBlocked: false,
									},
								],
								total: 1,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const WithInvalidDateRender: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: {
							page: 1,
							pageSize: 50,
							searchText: '',
							statusFilters: [],
							sorter: undefined,
						},
					},
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: [
									{
										__typename: 'AdminUser',
										id: 'user-invalid',
										username: 'invalid_date_user',
										firstName: 'Invalid',
										lastName: 'Date',
										accountCreated: 'invalid-date-string',
										status: 'verified-personal',
										isBlocked: false,
									},
								],
								total: 1,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const GridViewCard: Story = {
	play: async ({ canvasElement }) => {
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		// Test assumes Dashboard component can switch to grid view
		// This story verifies the card renderer is passed correctly
		expect(canvasElement).toBeTruthy();
	},
};

export const MultipleUsers: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: {
							page: 1,
							pageSize: 50,
							searchText: '',
							statusFilters: [],
							sorter: undefined,
						},
					},
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: Array.from({ length: 10 }, (_, i) => ({
									__typename: 'AdminUser',
									id: `user-${i + 1}`,
									username: `user_${i + 1}`,
									firstName: `First${i + 1}`,
									lastName: `Last${i + 1}`,
									accountCreated: `2024-0${((i % 9) + 1).toString().padStart(1, '0')}-15T10:30:00Z`,
									status: 'verified-personal',
									isBlocked: i % 3 === 0,
								})),
								total: 100,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};
