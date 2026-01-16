import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from 'storybook/test';
import { TermsContainer } from './terms.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import {
	TermsContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
	TermsContainerPersonalUserUpdateDocument,
} from '../../../../generated.tsx';

const meta: Meta<typeof TermsContainer> = {
	title: 'Signup/TermsContainer',
	component: TermsContainer,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [withMockApolloClient, withMockRouter('/signup/terms')],
  tags: ['!dev'], // not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock user with non-verified-personal account type (should navigate to home after update)
const mockNonVerifiedPersonalUser = {
	request: {
		query: TermsContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
		variables: {},
	},
	result: {
		data: {
			currentPersonalUserAndCreateIfNotExists: {
				__typename: 'PersonalUser' as const,
				id: 'user-123',
				hasCompletedOnboarding: false,
				account: {
					__typename: 'PersonalUserAccount' as const,
					accountType: 'non-verified-personal',
				},
			},
		},
	},
};

// Mock user with verified-personal-plus account type (should navigate to payment)
const mockVerifiedPersonalPlusUser = {
	request: {
		query: TermsContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
		variables: {},
	},
	result: {
		data: {
			currentPersonalUserAndCreateIfNotExists: {
				__typename: 'PersonalUser' as const,
				id: 'user-456',
				hasCompletedOnboarding: false,
				account: {
					__typename: 'PersonalUserAccount' as const,
					accountType: 'verified-personal-plus',
				},
			},
		},
	},
};

// Mock successful update mutation
const mockSuccessfulUpdate = {
	request: {
		query: TermsContainerPersonalUserUpdateDocument,
		variables: {
			input: {
				id: 'user-123',
				hasCompletedOnboarding: true,
			},
		},
	},
	result: {
		data: {
			personalUserUpdate: {
				__typename: 'PersonalUserMutationResult' as const,
				status: {
					__typename: 'MutationStatus' as const,
					success: true,
					errorMessage: null,
				},
				personalUser: {
					__typename: 'PersonalUser' as const,
					id: 'user-123',
					hasCompletedOnboarding: true,
				},
			},
		},
	},
};

// Mock failed update mutation
const mockFailedUpdate = {
	request: {
		query: TermsContainerPersonalUserUpdateDocument,
		variables: {
			input: {
				id: 'user-789',
				hasCompletedOnboarding: true,
			},
		},
	},
	result: {
		data: {
			personalUserUpdate: {
				__typename: 'PersonalUserMutationResult' as const,
				status: {
					__typename: 'MutationStatus' as const,
					success: false,
					errorMessage: 'Failed to update user',
				},
				personalUser: null,
			},
		},
	},
};

export const NonVerifiedPersonal: Story = {
	parameters: {
		apolloClient: {
			mocks: [mockNonVerifiedPersonalUser, mockSuccessfulUpdate],
		},
	},
	play: async ({ canvasElement, step }) => {
		const { findByRole } = within(canvasElement);
		
		await step('Wait for form to load', async () => {
			await findByRole('checkbox', { name: /accept.*terms/i });
		});
		
		await step('Check terms checkbox', async () => {
			const checkbox = await findByRole('checkbox', { name: /accept.*terms/i });
			await userEvent.click(checkbox);
		});
		
		await step('Click Save and Continue button', async () => {
			const saveButton = await findByRole('button', { name: /Save.*Continue/i });
			await userEvent.click(saveButton);
			await new Promise(resolve => setTimeout(resolve, 500));
		});
	},
};

export const VerifiedPersonalPlus: Story = {
	parameters: {
		apolloClient: {
			mocks: [mockVerifiedPersonalPlusUser],
		},
	},
	play: async ({ canvasElement, step }) => {
		const { findByRole } = within(canvasElement);
		
		await step('Wait for form to load', async () => {
			await findByRole('checkbox', { name: /accept.*terms/i });
		});
		
		await step('Check terms checkbox', async () => {
			const checkbox = await findByRole('checkbox', { name: /accept.*terms/i });
			await userEvent.click(checkbox);
		});
		
		await step('Click Save and Continue for Plus user', async () => {
			const saveButton = await findByRole('button', { name: /Save.*Continue/i });
			await userEvent.click(saveButton);
			await new Promise(resolve => setTimeout(resolve, 500));
		});
	},
};

export const UpdateFailed: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: TermsContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
						variables: {},
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: {
								__typename: 'PersonalUser' as const,
								id: 'user-789',
								hasCompletedOnboarding: false,
								account: {
									__typename: 'PersonalUserAccount' as const,
									accountType: 'non-verified-personal',
								},
							},
						},
					},
				},
				mockFailedUpdate,
			],
		},
	},
	play: async ({ canvasElement, step }) => {
		const { findByRole } = within(canvasElement);
		
		await step('Wait for form to load', async () => {
			await findByRole('checkbox', { name: /accept.*terms/i });
		});
		
		await step('Check terms checkbox', async () => {
			const checkbox = await findByRole('checkbox', { name: /accept.*terms/i });
			await userEvent.click(checkbox);
		});
		
		await step('Click Save and Continue that will fail', async () => {
			const saveButton = await findByRole('button', { name: /Save.*Continue/i });
			await userEvent.click(saveButton);
		});
		
		await step('Wait for error message', async () => {
			// Wait a bit for error to appear
			await new Promise(resolve => setTimeout(resolve, 1000));
		});
	},
};
