import type { Meta, StoryObj } from '@storybook/react';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import {
	PaymentContainerAccountPlansDocument,
	PaymentContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
	PaymentContainerPersonalUserCybersourcePublicKeyIdDocument,
	type PersonalUser,
	type AccountPlan,
} from '../../../../generated.tsx';
import { SignupRoutes } from '../index.tsx';
import { mockAccountPlans } from '../../../../test-utils/storybook-mock-helpers.ts';

const meta: Meta<typeof SignupRoutes> = {
	title: 'Pages/Signup/Payment',
	component: SignupRoutes,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [withMockApolloClient, withMockRouter('/payment')],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockUserSarah: PersonalUser = {
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
						query: PaymentContainerPersonalUserCybersourcePublicKeyIdDocument,
					},
					result: {
						data: {
							personalUserCybersourcePublicKeyId:
								'test-public-key-id',
						},
					},
				},
				{
					request: {
						query:
							PaymentContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockUserSarah,
						},
					},
				},
				{
					request: {
						query: PaymentContainerAccountPlansDocument,
					},
					result: {
						data: {
							accountPlans: mockAccountPlans,
						},
					},
				},
			],
		},
	},
};
