import type { Meta, StoryObj } from '@storybook/react';
import { PaymentPage } from './payment-page.tsx';
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

const meta: Meta<typeof PaymentPage> = {
	title: 'Pages/Signup/Payment',
	component: PaymentPage,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [withMockApolloClient, withMockRouter('/signup/account-setup')],
};

export default meta;
type Story = StoryObj<typeof PaymentPage>;

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

const mockAccountPlans: AccountPlan[] = [
	{
		name: 'non-verified-personal',
		description: 'Non-Verified Personal',
		billingPeriodLength: 0,
		billingPeriodUnit: 'month',
		billingAmount: 0,
		currency: 'USD',
		setupFee: 0,
		feature: {
			activeReservations: 0,
			bookmarks: 3,
			itemsToShare: 15,
			friends: 5,
			__typename: 'AccountPlanFeature',
		},
		status: null,
		cybersourcePlanId: null,
		id: '607f1f77bcf86cd799439001',
		schemaVersion: '1.0.0',
		createdAt: '2023-05-02T10:00:00.000Z',
		updatedAt: '2023-05-02T10:00:00.000Z',
		__typename: 'AccountPlan',
	},
	{
		name: 'verified-personal',
		description: 'Verified Personal',
		billingPeriodLength: 0,
		billingPeriodUnit: 'month',
		billingAmount: 0,
		currency: 'USD',
		setupFee: 0,
		feature: {
			activeReservations: 10,
			bookmarks: 10,
			itemsToShare: 30,
			friends: 10,
			__typename: 'AccountPlanFeature',
		},
		status: null,
		cybersourcePlanId: null,
		id: '607f1f77bcf86cd799439002',
		schemaVersion: '1.0.0',
		createdAt: '2023-05-02T10:00:00.000Z',
		updatedAt: '2023-05-02T10:00:00.000Z',
		__typename: 'AccountPlan',
	},
	{
		name: 'verified-personal-plus',
		description: 'Verified Personal Plus',
		billingPeriodLength: 12,
		billingPeriodUnit: 'month',
		billingAmount: 4.99,
		currency: 'USD',
		setupFee: 0,
		feature: {
			activeReservations: 30,
			bookmarks: 30,
			itemsToShare: 50,
			friends: 30,
			__typename: 'AccountPlanFeature',
		},
		status: 'active',
		cybersourcePlanId: 'cybersource_plan_001',
		id: '607f1f77bcf86cd799439000',
		schemaVersion: '1.0.0',
		createdAt: '2023-05-02T10:00:00.000Z',
		updatedAt: '2023-05-02T10:00:00.000Z',
		__typename: 'AccountPlan',
	},
];

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
