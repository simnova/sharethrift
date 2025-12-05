import type { Meta, StoryObj } from '@storybook/react';
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
};

export const VerifiedPersonalPlus: Story = {
	parameters: {
		apolloClient: {
			mocks: [mockVerifiedPersonalPlusUser],
		},
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
};
