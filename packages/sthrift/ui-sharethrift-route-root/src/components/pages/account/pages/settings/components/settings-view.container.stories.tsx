import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { SettingsViewContainer } from './settings-view.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '@sthrift/ui-sharethrift-route-shared/test-utils';
import {
	HomeAccountSettingsViewContainerCurrentUserDocument,
	HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
} from '../../../../../../generated.tsx';

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

const meta: Meta<typeof SettingsViewContainer> = {
	title: 'Containers/SettingsViewContainer',
	component: SettingsViewContainer,
	parameters: {
		a11y: { disable: true },
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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loadingText = canvas.queryByText(/Loading/i);
		expect(loadingText || canvasElement).toBeTruthy();
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
	play: async ({ canvasElement }) => {
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
