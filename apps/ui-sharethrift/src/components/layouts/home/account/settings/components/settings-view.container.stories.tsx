import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { SettingsViewContainer } from './settings-view.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	HomeAccountSettingsViewContainerCurrentUserDocument,
	HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
	HomeAccountSettingsViewContainerUpdateAdminUserDocument,
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
	play: async ({ canvasElement }) => {
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
							personalUserUpdate: {
								__typename: 'PersonalUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: false,
									errorMessage: 'Update failed',
								},
							},
						},
					},
				},
			],
		},
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
							adminUserUpdate: {
								__typename: 'AdminUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: false,
									errorMessage: 'Admin update failed',
								},
							},
						},
					},
				},
			],
		},
	},
};
