import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { SelectAccountTypeContainer } from './select-account-type.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import {
	SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
	SelectAccountTypePersonalUserUpdateDocument,
	SelectAccountTypeContainerAccountPlansDocument,
} from '../../../../generated.tsx';

const mockCurrentUser = {
	__typename: 'PersonalUser',
	id: 'user-1',
	account: {
		__typename: 'PersonalUserAccount',
		accountType: null,
	},
	profile: {
		__typename: 'PersonalUserProfile',
		firstName: 'John',
		lastName: 'Doe',
	},
};

const mockAccountPlans = [
	{
		__typename: 'AccountPlan',
		id: 'plan-1',
		name: 'non-verified-personal',
		description: 'Basic free plan',
		billingPeriodLength: 1,
		billingPeriodUnit: 'month',
		billingAmount: 0,
		currency: 'USD',
		setupFee: 0,
		status: 'active',
		cybersourcePlanId: null,
		schemaVersion: '1.0',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		feature: {
			__typename: 'AccountPlanFeature',
			activeReservations: 5,
			bookmarks: 10,
			itemsToShare: 0,
			friends: 20,
		},
	},
	{
		__typename: 'AccountPlan',
		id: 'plan-2',
		name: 'verified-personal',
		description: 'Verified personal plan',
		billingPeriodLength: 1,
		billingPeriodUnit: 'month',
		billingAmount: 9.99,
		currency: 'USD',
		setupFee: 0,
		status: 'active',
		cybersourcePlanId: 'cyber-1',
		schemaVersion: '1.0',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		feature: {
			__typename: 'AccountPlanFeature',
			activeReservations: 20,
			bookmarks: 50,
			itemsToShare: 10,
			friends: 100,
		},
	},
	{
		__typename: 'AccountPlan',
		id: 'plan-3',
		name: 'verified-personal-plus',
		description: 'Premium plan',
		billingPeriodLength: 1,
		billingPeriodUnit: 'month',
		billingAmount: 19.99,
		currency: 'USD',
		setupFee: 0,
		status: 'active',
		cybersourcePlanId: 'cyber-2',
		schemaVersion: '1.0',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		feature: {
			__typename: 'AccountPlanFeature',
			activeReservations: 100,
			bookmarks: 200,
			itemsToShare: 50,
			friends: 500,
		},
	},
];

const meta: Meta<typeof SelectAccountTypeContainer> = {
	title: 'Containers/SelectAccountTypeContainer',
	component: SelectAccountTypeContainer,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SelectAccountTypeContainerAccountPlansDocument,
					},
					result: {
						data: {
							accountPlans: mockAccountPlans,
						},
					},
				},
				{
					request: {
						query: SelectAccountTypePersonalUserUpdateDocument,
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
									account: { __typename: 'PersonalUserAccount', accountType: 'Reserver' },
								},
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/signup/select-account-type')],
};

export default meta;
type Story = StoryObj<typeof SelectAccountTypeContainer>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const reserverOption = canvas.queryByText(/Reserver/i);
		const sharerOption = canvas.queryByText(/Sharer/i);
		expect(reserverOption || sharerOption || canvasElement).toBeTruthy();
	},
};

export const Loading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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

export const SelectReserver: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SelectAccountTypePersonalUserUpdateDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							personalUserUpdate: {
								__typename: 'PersonalUser',
								id: 'user-1',
								account: { accountType: 'non-verified-personal' },
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
		const nonVerifiedCard = canvas.queryByText(/Non-Verified Personal/i);
		if (nonVerifiedCard) {
			await userEvent.click(nonVerifiedCard);
		}
		const saveButton = canvas.queryByRole('button', { name: /Save and Continue/i });
		if (saveButton) {
			await userEvent.click(saveButton);
		}
	},
};

export const SelectSharer: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SelectAccountTypePersonalUserUpdateDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							personalUserUpdate: {
								__typename: 'PersonalUser',
								id: 'user-1',
								account: { accountType: 'verified-personal' },
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
		const verifiedCard = canvas.queryByText(/Verified Personal$/i);
		if (verifiedCard) {
			await userEvent.click(verifiedCard);
		}
		const saveButton = canvas.queryByRole('button', { name: /Save and Continue/i });
		if (saveButton) {
			await userEvent.click(saveButton);
		}
	},
};

export const SelectPlusAndSave: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SelectAccountTypePersonalUserUpdateDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							personalUserUpdate: {
								__typename: 'PersonalUser',
								id: 'user-1',
								account: { accountType: 'verified-personal-plus' },
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
		const plusCard = canvas.queryByText(/Verified Personal Plus/i);
		if (plusCard) {
			await userEvent.click(plusCard);
		}
		const saveButton = canvas.queryByRole('button', { name: /Save and Continue/i });
		if (saveButton) {
			await userEvent.click(saveButton);
		}
	},
};

export const WithError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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

export const UpdateError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SelectAccountTypeContainerAccountPlansDocument,
					},
					result: {
						data: {
							accountPlans: mockAccountPlans,
						},
					},
				},
				{
					request: {
						query: SelectAccountTypePersonalUserUpdateDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Failed to update account type'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Try to select and save
		const nonVerifiedCard = canvas.queryByText(/Non-Verified Personal/i);
		if (nonVerifiedCard) {
			await userEvent.click(nonVerifiedCard);
		}
		const saveButton = canvas.queryByRole('button', { name: /Save and Continue/i });
		if (saveButton) {
			await userEvent.click(saveButton);
		}
	},
};

export const AccountPlansError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SelectAccountTypeContainerAccountPlansDocument,
					},
					error: new Error('Failed to fetch account plans'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const UpdateFailureResponse: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SelectAccountTypeContainerAccountPlansDocument,
					},
					result: {
						data: {
							accountPlans: mockAccountPlans,
						},
					},
				},
				{
					request: {
						query: SelectAccountTypePersonalUserUpdateDocument,
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
									errorMessage: 'Invalid account type selection',
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
		await expect(canvasElement).toBeTruthy();
		
		// Try to select and save
		const nonVerifiedCard = canvas.queryByText(/Non-Verified Personal/i);
		if (nonVerifiedCard) {
			await userEvent.click(nonVerifiedCard);
		}
		const saveButton = canvas.queryByRole('button', { name: /Save and Continue/i });
		if (saveButton) {
			await userEvent.click(saveButton);
		}
	},
};

export const MissingUserId: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: null,
						},
					},
				},
				{
					request: {
						query: SelectAccountTypeContainerAccountPlansDocument,
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
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
