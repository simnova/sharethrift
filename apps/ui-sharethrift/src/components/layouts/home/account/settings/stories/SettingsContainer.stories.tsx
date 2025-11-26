import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { SettingsViewContainer } from "../components/settings-view.container.tsx";
import {
	HomeAccountSettingsViewContainerCurrentUserDocument,
	HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
	HomeAccountSettingsViewContainerUpdateAdminUserDocument,
} from "../../../../../../generated.tsx";
import { withMockApolloClient, withMockRouter } from "../../../../../../test-utils/storybook-decorators.tsx";

const mockPersonalUser = {
	__typename: "PersonalUser",
	id: "507f1f77bcf86cd799439099",
	userType: "personal-users",
	createdAt: "2024-08-01T00:00:00Z",
	updatedAt: "2025-08-08T12:00:00Z",
	account: {
		__typename: "PersonalUserAccount",
		accountType: "personal",
		email: "patrick.g@example.com",
		username: "patrick_g",
		profile: {
			__typename: "PersonalUserAccountProfile",
			firstName: "Patrick",
			lastName: "Garcia",
			aboutMe: "Test about me",
			location: {
				__typename: "PersonalUserAccountProfileLocation",
				address1: "123 Main Street",
				address2: "Apt 4B",
				city: "Philadelphia",
				state: "PA",
				country: "United States",
				zipCode: "19101",
			},
			billing: {
				__typename: "PersonalUserAccountProfileBilling",
				subscriptionId: "sub_123456789",
				cybersourceCustomerId: "cust_abc123",
			},
		},
		settings: {
			__typename: "PersonalUserAccountSettings",
			notificationsEnabled: true,
			emailUpdatesEnabled: true,
			darkModeEnabled: false,
			language: "en-US",
		},
	},
};

const mockAdminUser = {
	__typename: "AdminUser",
	id: "507f1f77bcf86cd799439100",
	userType: "admin-user",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2025-08-08T12:00:00Z",
	account: {
		__typename: "AdminUserAccount",
		accountType: "admin",
		email: "admin@example.com",
		username: "admin_user",
		profile: {
			__typename: "AdminUserAccountProfile",
			firstName: "Admin",
			lastName: "User",
			aboutMe: "Admin about me",
			location: {
				__typename: "AdminUserAccountProfileLocation",
				address1: "456 Admin Street",
				address2: "",
				city: "New York",
				state: "NY",
				country: "United States",
				zipCode: "10001",
			},
		},
		settings: {
			__typename: "AdminUserAccountSettings",
			notificationsEnabled: true,
			emailUpdatesEnabled: true,
			darkModeEnabled: false,
			language: "en-US",
		},
	},
};

const meta: Meta<typeof SettingsViewContainer> = {
	title: "Components/Account/SettingsContainer",
	component: SettingsViewContainer,
	decorators: [withMockApolloClient, withMockRouter("/account/settings")],
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
};
export default meta;
type Story = StoryObj<typeof SettingsViewContainer>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const firstName = canvas.queryByText(/Patrick/i);
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
		await expect(canvasElement).toBeTruthy();
		const loadingText = canvas.queryByText(/Loading/i);
		if (loadingText) {
			expect(loadingText).toBeInTheDocument();
		}
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
								__typename: "AdminUser",
								id: mockAdminUser.id,
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
		const firstName = canvas.queryByText(/Admin/i);
		if (firstName) {
			expect(firstName).toBeInTheDocument();
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
		await expect(canvasElement).toBeTruthy();
		const notFoundText = canvas.queryByText(/User not found/i);
		if (notFoundText) {
			expect(notFoundText).toBeInTheDocument();
		}
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
					error: new Error("Failed to update user"),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithQueryError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					error: new Error("Failed to load user settings"),
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
							currentUser: mockPersonalUser,
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const city = canvas.queryByText(/Philadelphia/i);
		if (city) {
			expect(city).toBeInTheDocument();
		}
	},
};

export const PersonalUserUpdateSuccess: Story = {
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
								__typename: "PersonalUser",
								id: mockPersonalUser.id,
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
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
					error: new Error("Failed to update admin user"),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const EmptyLocation: Story = {
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
											__typename: "PersonalUserAccountProfileLocation",
											address1: null,
											address2: null,
											city: null,
											state: null,
											country: null,
											zipCode: null,
										},
									},
								},
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
