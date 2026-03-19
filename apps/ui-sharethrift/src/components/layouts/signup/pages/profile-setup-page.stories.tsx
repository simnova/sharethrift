import type { Meta, StoryObj } from '@storybook/react';
import ProfileSetupPage from './profile-setup-page.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import {
	ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
	type PersonalUser,
} from '../../../../generated.tsx';

const meta: Meta<typeof ProfileSetupPage> = {
	title: 'Pages/Signup/ProfileSetup',
	component: ProfileSetupPage,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [withMockApolloClient, withMockRouter('/signup/profile-setup')],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockDefaultPersonalUser: PersonalUser = {
	id: '507f1f77bcf86cd799439099',
};

const mockUserSarahWithPrefilledData: PersonalUser = {
	id: '507f1f77bcf86cd799439099',
	userType: 'personal-user',
	account: {
		accountType: 'verified-personal-plus',

		username: 'sarahwilliams',
		email: 'sarah.williams@example.com',
		profile: {
			firstName: 'Sarah',
			lastName: 'Williams',
			location: {
				city: 'Philadelphia',
				state: 'PA',
				address1: '123 Main St',
				address2: 'Apt 4B',
				country: 'US',
				zipCode: '19103',
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
							ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockDefaultPersonalUser,
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
							ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists:
								mockUserSarahWithPrefilledData,
						},
					},
				},
			],
		},
	},
};
