import type { Meta, StoryObj } from '@storybook/react';
import AccountSetupPage from './account-setup-page.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import  { AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument, type PersonalUser } from '../../../../generated.tsx';

const meta: Meta<typeof AccountSetupPage> = {
	title: 'Pages/Signup/AccountSetup',
	component: AccountSetupPage,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [withMockApolloClient, withMockRouter('/signup/account-setup')],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockUserSarah: PersonalUser = {
	id: '507f1f77bcf86cd799439099',
	userType: 'personal-user',
	account: {
		accountType: 'verified-personal',

		username: '',
		email: 'sarah.williams@example.com',
		profile: {
			firstName: 'Sarah',
			lastName: 'Williams',
			location: {
				city: 'Philadelphia',
				state: 'PA',
			},
		},
	},

	createdAt: '2024-08-01T00:00:00Z',
	updatedAt: '2024-08-15T12:00:00Z',
};

export const Default: Story = {
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
							currentPersonalUserAndCreateIfNotExists: mockUserSarah,
						},
					},
				},
			],
		},
	},
};

export const WithPrefilledData: Story = {
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
							currentPersonalUserAndCreateIfNotExists: {...mockUserSarah, account:{
                ...mockUserSarah.account,
                username: 'sarah_williams',
              }},
						},
					},
				},
			],
		},
	},
};
