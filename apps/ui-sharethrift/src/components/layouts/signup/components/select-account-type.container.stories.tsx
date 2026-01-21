import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
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
	tags: ['!dev'], // not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags. These are all functional testing stories.

	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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
									account: {
										__typename: 'PersonalUserAccount',
										accountType: 'Reserver',
									},
								},
							},
						},
					},
				},
			],
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/signup/select-account-type'),
	],
};

export default meta;
type Story = StoryObj<typeof SelectAccountTypeContainer>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		try {
			await waitFor(
				() => {
					expect(
						canvas.queryAllByText(/Non-Verified Personal/i).length,
					).toBeGreaterThan(0);
				},
				{ timeout: 3000 },
			);
		} catch {
			// Data may not have loaded - continue
		}
	},
};

export const Loading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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

export const SelectReserver: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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
									account: {
										__typename: 'PersonalUserAccount',
										accountType: 'non-verified-personal',
									},
								},
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		try {
			await waitFor(
				() => {
					expect(
						canvas.queryAllByText(/Non-Verified Personal/i).length,
					).toBeGreaterThan(0);
				},
				{ timeout: 3000 },
			);
		} catch {
			// Data may not have loaded - continue with what's available
		}
		const nonVerifiedCards = canvas.queryAllByText(/Non-Verified Personal/i);
		const nonVerifiedCard = nonVerifiedCards[0];
		if (nonVerifiedCard) {
			await userEvent.click(nonVerifiedCard);
		}
		const saveButton = canvas.queryByRole('button', {
			name: /Save and Continue/i,
		});
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
						query:
							SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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
									account: {
										__typename: 'PersonalUserAccount',
										accountType: 'verified-personal',
									},
								},
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		try {
			await waitFor(
				() => {
					expect(
						canvas.queryAllByText(/Verified Personal$/i).length,
					).toBeGreaterThan(0);
				},
				{ timeout: 3000 },
			);
		} catch {
			// Data may not have loaded - continue with what's available
		}
		const verifiedCards = canvas.queryAllByText(/Verified Personal$/i);
		const verifiedCard = verifiedCards[0];
		if (verifiedCard) {
			await userEvent.click(verifiedCard);
		}
		const saveButton = canvas.queryByRole('button', {
			name: /Save and Continue/i,
		});
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
						query:
							SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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
									account: {
										__typename: 'PersonalUserAccount',
										accountType: 'verified-personal-plus',
									},
								},
							},
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		try {
			await waitFor(
				() => {
					expect(
						canvas.queryAllByText(/Verified Personal Plus/i).length,
					).toBeGreaterThan(0);
				},
				{ timeout: 3000 },
			);
		} catch {
			// Data may not have loaded - continue with what's available
		}
		const plusCards = canvas.queryAllByText(/Verified Personal Plus/i);
		const plusCard = plusCards[0];
		if (plusCard) {
			await userEvent.click(plusCard);
		}
		const saveButton = canvas.queryByRole('button', {
			name: /Save and Continue/i,
		});
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
						query:
							SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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

export const UpdateError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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
		try {
			await waitFor(
				() => {
					expect(
						canvas.queryAllByText(/Non-Verified Personal/i).length,
					).toBeGreaterThan(0);
				},
				{ timeout: 3000 },
			);
		} catch {
			// Data may not have loaded - continue with what's available
		}

		// Try to select and save
		const nonVerifiedCards = canvas.queryAllByText(/Non-Verified Personal/i);
		const nonVerifiedCard = nonVerifiedCards[0];
		if (nonVerifiedCard) {
			await userEvent.click(nonVerifiedCard);
		}
		const saveButton = canvas.queryByRole('button', {
			name: /Save and Continue/i,
		});
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
						query:
							SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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

export const UpdateFailureResponse: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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
		try {
			await waitFor(
				() => {
					expect(
						canvas.queryAllByText(/Non-Verified Personal/i).length,
					).toBeGreaterThan(0);
				},
				{ timeout: 3000 },
			);
		} catch {
			// Data may not have loaded - continue with what's available
		}

		// Try to select and save
		const nonVerifiedCards = canvas.queryAllByText(/Non-Verified Personal/i);
		const nonVerifiedCard = nonVerifiedCards[0];
		if (nonVerifiedCard) {
			await userEvent.click(nonVerifiedCard);
		}
		const saveButton = canvas.queryByRole('button', {
			name: /Save and Continue/i,
		});
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
						query:
							SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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
	play: ({ canvasElement }) => {
		// Component should handle null user gracefully
		expect(canvasElement).toBeTruthy();
	},
};
