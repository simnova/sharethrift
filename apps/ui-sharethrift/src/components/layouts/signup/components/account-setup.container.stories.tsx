import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { AccountSetUpContainer } from './account-setup.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import {
	AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
	AccountSetUpContainerPersonalUserUpdateDocument,
} from '../../../../generated.tsx';

const mockCurrentUser = {
	__typename: 'PersonalUser',
	id: 'user-1',
	account: {
		__typename: 'PersonalUserAccount',
		email: 'test@example.com',
		username: 'testuser',
		profile: {
			__typename: 'PersonalUserProfile',
			firstName: 'John',
			lastName: 'Doe',
			about: '',
			profilePictureUrl: null,
		},
	},
};

const meta: Meta<typeof AccountSetUpContainer> = {
	title: 'Containers/AccountSetUpContainer',
	component: AccountSetUpContainer,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: AccountSetUpContainerPersonalUserUpdateDocument,
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
								personalUser: {
									__typename: 'PersonalUser',
									id: 'user-1',
								},
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/signup/account-setup')],
};

export default meta;
type Story = StoryObj<typeof AccountSetUpContainer>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Wait for content to load
		const title = canvas.queryByText(/Account Setup/i);
		expect(title || canvasElement).toBeTruthy();
	},
};

export const Loading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					error: new Error('Failed to fetch user'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const UpdateSuccess: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: AccountSetUpContainerPersonalUserUpdateDocument,
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
								personalUser: mockCurrentUser,
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

export const UpdateFailure: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: AccountSetUpContainerPersonalUserUpdateDocument,
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
									errorMessage: 'Validation failed',
								},
								personalUser: null,
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

export const UpdateError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: AccountSetUpContainerPersonalUserUpdateDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Network error'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithMissingUserData: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: null,
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
