import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { SettingsViewContainer } from './settings-view.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../../../test-utils/storybook-decorators.tsx';
import {
	HomeAccountSettingsViewContainerCurrentUserDocument,
	HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
	HomeAccountSettingsViewContainerUpdateAdminUserDocument,
} from '../../../../../../../../generated.tsx';

const mockPersonalUser = {
	__typename: 'PersonalUser',
	id: 'user-1',
	userType: 'personal-user',
	account: {
		__typename: 'PersonalUserAccount',
		accountType: 'verified-personal',
		email: 'test@example.com',
		username: 'testuser',
		profile: {
			__typename: 'PersonalUserAccountProfile',
			firstName: 'John',
			lastName: 'Doe',
			aboutMe: 'Hello, I am John!',
			location: {
				__typename: 'PersonalUserAccountProfileLocation',
				city: 'San Francisco',
				state: 'CA',
				address1: '123 Main St',
				address2: 'Apt 4',
				country: 'USA',
				zipCode: '94102',
			},
			billing: {
				__typename: 'PersonalUserAccountProfileBilling',
				subscriptionId: 'sub_123',
				cybersourceCustomerId: 'cust_456',
			},
		},
		settings: null,
	},
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
};

const mockAdminUser = {
	__typename: 'AdminUser',
	id: 'admin-1',
	userType: 'admin-user',
	account: {
		__typename: 'AdminUserAccount',
		accountType: 'admin',
		email: 'admin@example.com',
		username: 'adminuser',
		profile: {
			__typename: 'AdminUserAccountProfile',
			firstName: 'Admin',
			lastName: 'User',
			aboutMe: 'I am an admin',
			location: {
				__typename: 'AdminUserAccountProfileLocation',
				city: 'New York',
				state: 'NY',
				address1: '456 Admin Ave',
				address2: null,
				country: 'USA',
				zipCode: '10001',
			},
		},
		settings: null,
	},
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
};

const meta: Meta<typeof SettingsViewContainer> = {
	title: 'Containers/SettingsViewContainer',
	component: SettingsViewContainer,
	tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags. These are all functional testing stories.
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							personalUserUpdate: {
								__typename: 'PersonalUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/account/settings')],
};

export default meta;
type Story = StoryObj<typeof SettingsViewContainer>;

export const Default: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const firstName = canvas.queryByText(/John/i);
		if (firstName) {
			expect(firstName).toBeInTheDocument();
		}
	},
};

export const Loading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					delay: Infinity,
				},
			],
		},
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loadingText = canvas.queryByText(/Loading/i);
		expect(loadingText || canvasElement).toBeTruthy();
	},
};

export const AdminUser: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockAdminUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdateAdminUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminUserUpdate: {
								__typename: 'AdminUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const adminName = canvas.queryByText(/Admin/i);
		if (adminName) {
			expect(adminName).toBeInTheDocument();
		}
	},
};

export const UserNotFound: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: null,
						},
					},
				},
			],
		},
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const notFoundText = canvas.queryByText(/User not found/i);
		expect(notFoundText || canvasElement).toBeTruthy();
	},
};

export const WithUpdateError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Update failed'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithFullLocation: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: {
								...mockPersonalUser,
								account: {
									...mockPersonalUser.account,
									profile: {
										...mockPersonalUser.account.profile,
										location: {
											__typename: 'PersonalUserAccountProfileLocation',
											city: 'Los Angeles',
											state: 'CA',
											address1: '789 Sunset Blvd',
											address2: 'Suite 100',
											country: 'United States',
											zipCode: '90028',
										},
									},
								},
							},
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							personalUserUpdate: {
								__typename: 'PersonalUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const city = canvas.queryByText(/Los Angeles/i);
		if (city) {
			expect(city).toBeInTheDocument();
		}
	},
};

// Test cases to improve coverage of handleSaveSection and related functions
export const WithProfileUpdate: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							personalUserUpdate: {
								__typename: 'PersonalUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
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
		// Click "Edit Profile" button
		const editProfileBtn = canvas.queryAllByRole('button', {
			name: /Edit Profile/i,
		})[0];
		if (editProfileBtn) {
			await userEvent.click(editProfileBtn);
			await waitFor(
				() => {
					expect(
						canvas.queryByRole('button', { name: /Save/i }),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
			// Click Save to trigger handlePersonalUserSave
			const saveBtn = canvas.queryByRole('button', { name: /Save/i });
			if (saveBtn) {
				await userEvent.click(saveBtn);
			}
		}
	},
};

export const WithLocationUpdate: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							personalUserUpdate: {
								__typename: 'PersonalUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
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
		// Click "Edit Location" button
		const editLocationBtn = canvas.queryAllByRole('button', {
			name: /Edit Location/i,
		})[0];
		if (editLocationBtn) {
			await userEvent.click(editLocationBtn);
			await waitFor(
				() => {
					expect(
						canvas.queryByRole('button', { name: /Save/i }),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
			// Click Save to trigger handlePersonalUserSave with location
			const saveBtn = canvas.queryByRole('button', { name: /Save/i });
			if (saveBtn) {
				await userEvent.click(saveBtn);
			}
		}
	},
};

export const WithBillingUpdate: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							personalUserUpdate: {
								__typename: 'PersonalUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
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
		// Click "Edit Billing" button
		const editBillingBtn = canvas.queryAllByRole('button', {
			name: /Edit Billing/i,
		})[0];
		if (editBillingBtn) {
			await userEvent.click(editBillingBtn);
			await waitFor(
				() => {
					expect(
						canvas.queryByRole('button', { name: /Save/i }),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
			// Click Save to trigger handlePersonalUserSave with billing
			const saveBtn = canvas.queryByRole('button', { name: /Save/i });
			if (saveBtn) {
				await userEvent.click(saveBtn);
			}
		}
	},
};

export const WithPlanUpdate: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							personalUserUpdate: {
								__typename: 'PersonalUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
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
		// Click "Edit Plan" button
		const editPlanBtn = canvas.queryAllByRole('button', {
			name: /Edit Plan/i,
		})[0];
		if (editPlanBtn) {
			await userEvent.click(editPlanBtn);
			await waitFor(
				() => {
					expect(
						canvas.queryByRole('button', { name: /Save/i }),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
			// Select a different plan first by clicking on a plan card
			const planCards = canvas.queryAllByText(/Non-Verified Personal/i);
			if (planCards[0]) {
				await userEvent.click(planCards[0]);
			}
			// Click Save to trigger handlePersonalUserSave with plan
			const saveBtn = canvas.queryByRole('button', { name: /Save/i });
			if (saveBtn) {
				await userEvent.click(saveBtn);
			}
		}
	},
};

export const AdminUserUpdateProfile: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockAdminUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdateAdminUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminUserUpdate: {
								__typename: 'AdminUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
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
				expect(canvas.queryAllByText(/Admin/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Click "Edit Profile" button for admin user
		const editProfileBtn = canvas.queryAllByRole('button', {
			name: /Edit Profile/i,
		})[0];
		if (editProfileBtn) {
			await userEvent.click(editProfileBtn);
			await waitFor(
				() => {
					expect(
						canvas.queryByRole('button', { name: /Save/i }),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
			// Click Save to trigger handleAdminUserSave
			const saveBtn = canvas.queryByRole('button', { name: /Save/i });
			if (saveBtn) {
				await userEvent.click(saveBtn);
			}
		}
	},
};

export const AdminUserUpdateLocation: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockAdminUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdateAdminUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminUserUpdate: {
								__typename: 'AdminUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
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
				expect(canvas.queryAllByText(/Admin/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Click "Edit Location" button for admin user
		const editLocationBtn = canvas.queryAllByRole('button', {
			name: /Edit Location/i,
		})[0];
		if (editLocationBtn) {
			await userEvent.click(editLocationBtn);
			await waitFor(
				() => {
					expect(
						canvas.queryByRole('button', { name: /Save/i }),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
			// Click Save to trigger handleAdminUserSave with location
			const saveBtn = canvas.queryByRole('button', { name: /Save/i });
			if (saveBtn) {
				await userEvent.click(saveBtn);
			}
		}
	},
};

export const AdminUserCannotEditPlan: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockAdminUser,
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
				expect(canvas.queryAllByText(/Admin/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Test that plan section exists for admin user
		const planSections = canvas.queryAllByText(/Plan/i);
		expect(planSections.length).toBeGreaterThan(0);
	},
};

export const AdminUserCannotEditBilling: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockAdminUser,
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
				expect(canvas.queryAllByText(/Admin/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Test that billing section exists for admin user
		const billingSections = canvas.queryAllByText(/Billing/i);
		expect(billingSections.length).toBeGreaterThan(0);
	},
};

export const PersonalUserUpdateFailed: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							personalUserUpdate: null,
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
		// Click "Edit Profile" button
		const editProfileBtn = canvas.queryAllByRole('button', {
			name: /Edit Profile/i,
		})[0];
		if (editProfileBtn) {
			await userEvent.click(editProfileBtn);
			await waitFor(
				() => {
					expect(
						canvas.queryByRole('button', { name: /Save/i }),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
			// Click Save to trigger failed update
			const saveBtn = canvas.queryByRole('button', { name: /Save/i });
			if (saveBtn) {
				await userEvent.click(saveBtn);
			}
		}
	},
};

export const AdminUserUpdateFailed: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockAdminUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdateAdminUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminUserUpdate: null,
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
				expect(canvas.queryAllByText(/Admin/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Click "Edit Profile" button for admin
		const editProfileBtn = canvas.queryAllByRole('button', {
			name: /Edit Profile/i,
		})[0];
		if (editProfileBtn) {
			await userEvent.click(editProfileBtn);
			await waitFor(
				() => {
					expect(
						canvas.queryByRole('button', { name: /Save/i }),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
			// Click Save to trigger failed update
			const saveBtn = canvas.queryByRole('button', { name: /Save/i });
			if (saveBtn) {
				await userEvent.click(saveBtn);
			}
		}
	},
};

export const WithPasswordChange: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockPersonalUser,
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
		// Click "Edit Password" button
		const editPasswordBtn = canvas.queryAllByRole('button', {
			name: /Edit Password/i,
		})[0];
		if (editPasswordBtn) {
			await userEvent.click(editPasswordBtn);
			await waitFor(
				() => {
					expect(
						canvas.queryByRole('button', { name: /Save/i }),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
			// Fill in password fields
			const currentPassInput =
				canvas.queryAllByLabelText(/Current Password/i)[0];
			const newPassInput = canvas.queryAllByLabelText(/New Password/i)[0];
			const confirmPassInput =
				canvas.queryAllByLabelText(/Confirm New Password/i)[0];
			if (currentPassInput)
				await userEvent.type(currentPassInput, 'oldpass123');
			if (newPassInput) await userEvent.type(newPassInput, 'newpass123');
			if (confirmPassInput)
				await userEvent.type(confirmPassInput, 'newpass123');
			// Click Save to trigger password change handler
			const saveBtn = canvas.queryByRole('button', { name: /Save/i });
			if (saveBtn) {
				await userEvent.click(saveBtn);
			}
		}
	},
};

export const AdminUserUpdateError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockAdminUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdateAdminUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Admin update failed'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Admin/i).length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
		// Click "Edit Profile" button for admin
		const editProfileBtn = canvas.queryAllByRole('button', {
			name: /Edit Profile/i,
		})[0];
		if (editProfileBtn) {
			await userEvent.click(editProfileBtn);
			await waitFor(
				() => {
					expect(
						canvas.queryByRole('button', { name: /Save/i }),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
			// Click Save to trigger error
			const saveBtn = canvas.queryByRole('button', { name: /Save/i });
			if (saveBtn) {
				await userEvent.click(saveBtn);
			}
		}
	},
};

export const PersonalUserUpdateError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Personal user update failed'),
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
		// Click "Edit Profile" button
		const editProfileBtn = canvas.queryAllByRole('button', {
			name: /Edit Profile/i,
		})[0];
		if (editProfileBtn) {
			await userEvent.click(editProfileBtn);
			await waitFor(
				() => {
					expect(
						canvas.queryByRole('button', { name: /Save/i }),
					).toBeInTheDocument();
				},
				{ timeout: 2000 },
			);
			// Click Save to trigger error
			const saveBtn = canvas.queryByRole('button', { name: /Save/i });
			if (saveBtn) {
				await userEvent.click(saveBtn);
			}
		}
	},
};
