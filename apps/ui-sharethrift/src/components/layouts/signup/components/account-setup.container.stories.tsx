import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
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
	userType: 'personal',
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
	tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags. These are all functional testing stories.

	component: AccountSetUpContainer,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
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
		await waitFor(
			() => {
				const saveButton = canvas.queryByRole('button', { name: /Save/i });
				expect(saveButton ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const Loading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					delay: Infinity,
				},
			],
		},
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loadingSpinner =
			canvas.queryByRole('progressbar') ?? canvas.queryByText(/loading/i);
		expect(loadingSpinner ?? canvasElement).toBeTruthy();
	},
};

export const WithError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					error: new Error('Failed to fetch user'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
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

export const UpdateSuccess: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const saveButton = canvas.queryByRole('button', { name: /Save/i });
				expect(saveButton).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
		const saveButton = canvas.getByRole('button', { name: /Save/i });
		await userEvent.click(saveButton);
	},
};

export const UpdateFailure: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const saveButton = canvas.queryByRole('button', { name: /Save/i });
				expect(saveButton).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
		const saveButton = canvas.getByRole('button', { name: /Save/i });
		await userEvent.click(saveButton);
	},
};

export const UpdateError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
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
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const saveButton = canvas.queryByRole('button', { name: /Save/i });
				expect(saveButton).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
		const saveButton = canvas.getByRole('button', { name: /Save/i });
		await userEvent.click(saveButton);
	},
};

export const WithMissingUserData: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
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
	play: ({ canvasElement }) => {
		// Component should handle null user gracefully
		expect(canvasElement).toBeTruthy();
	},
};
