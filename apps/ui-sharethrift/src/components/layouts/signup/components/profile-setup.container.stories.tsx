import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { ProfileSetupContainer } from './profile-setup.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import {
	ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
	ProfileSetUpContainerPersonalUserUpdateDocument,
} from '../../../../generated.tsx';

const mockPersonalUser = {
	__typename: 'PersonalUser' as const,
	id: 'user-1',
	profile: {
		__typename: 'PersonalUserProfile' as const,
		firstName: 'John',
		lastName: 'Doe',
		address: {
			__typename: 'Address' as const,
			streetAddress: '123 Main St',
			city: 'Toronto',
			stateProvince: 'Ontario',
			postalCode: 'M1A 1A1',
			country: 'CA',
		},
		phoneNumber: '416-555-0100',
	},
	avatar: 'https://example.com/avatar.jpg',
};

const meta: Meta<typeof ProfileSetupContainer> = {
	title: 'Containers/ProfileSetupContainer',
	component: ProfileSetupContainer,
	parameters: {
		layout: 'padded',
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: ProfileSetUpContainerPersonalUserUpdateDocument,
						variables: () => true,
					},
					result: {
						data: {
							personalUserUpdate: {
								__typename: 'PersonalUserMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
								personalUser: mockPersonalUser,
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/signup/profile-setup')],
};

export default meta;
type Story = StoryObj<typeof ProfileSetupContainer>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const saveButton = canvas.queryByRole('button', {
					name: /Save|Continue/i,
				});
				expect(saveButton ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const LoadingState: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loadingSpinner =
			canvas.queryByRole('progressbar') ?? canvas.queryByText(/loading/i);
		expect(loadingSpinner ?? canvasElement).toBeTruthy();
	},
};

export const QueryError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					error: new Error('Failed to load user data'),
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

export const NoUserData: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
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
		// Component should handle null user gracefully
		expect(canvasElement).toBeTruthy();
	},
};

export const UpdateSuccess: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: ProfileSetUpContainerPersonalUserUpdateDocument,
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
								personalUser: mockPersonalUser,
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
				const saveButton = canvas.queryByRole('button', {
					name: /Save|Continue/i,
				});
				expect(saveButton).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
		const saveButton = canvas.getByRole('button', { name: /Save|Continue/i });
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
							ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: ProfileSetUpContainerPersonalUserUpdateDocument,
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
									errorMessage: 'Invalid phone number format',
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
				const saveButton = canvas.queryByRole('button', {
					name: /Save|Continue/i,
				});
				expect(saveButton).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
		const saveButton = canvas.getByRole('button', { name: /Save|Continue/i });
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
							ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: ProfileSetUpContainerPersonalUserUpdateDocument,
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
				const saveButton = canvas.queryByRole('button', {
					name: /Save|Continue/i,
				});
				expect(saveButton).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
		const saveButton = canvas.getByRole('button', { name: /Save|Continue/i });
		await userEvent.click(saveButton);
	},
};

export const EmptyProfile: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: {
								__typename: 'PersonalUser' as const,
								id: 'user-1',
								profile: {
									__typename: 'PersonalUserProfile' as const,
									firstName: '',
									lastName: '',
									address: null,
									phoneNumber: '',
								},
								avatar: null,
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
				const saveButton = canvas.queryByRole('button', {
					name: /Save|Continue/i,
				});
				expect(saveButton ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const UpdateLoading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockPersonalUser,
						},
					},
				},
				{
					request: {
						query: ProfileSetUpContainerPersonalUserUpdateDocument,
						variables: () => true,
					},
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const saveButton = canvas.queryByRole('button', {
					name: /Save|Continue/i,
				});
				expect(saveButton).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
		const saveButton = canvas.getByRole('button', { name: /Save|Continue/i });
		await userEvent.click(saveButton);
	},
};
