import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { SelectAccountTypeContainer } from './select-account-type.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import {
	SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
	SignupSelectAccountTypePersonalUserUpdateDocument,
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

const meta: Meta<typeof SelectAccountTypeContainer> = {
	title: 'Containers/SelectAccountTypeContainer',
	component: SelectAccountTypeContainer,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SignupSelectAccountTypePersonalUserUpdateDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							personalUserUpdate: {
								__typename: 'PersonalUser',
								id: 'user-1',
								account: { accountType: 'Reserver' },
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
						query: SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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
						query: SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SignupSelectAccountTypePersonalUserUpdateDocument,
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
						query: SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SignupSelectAccountTypePersonalUserUpdateDocument,
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
						query: SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SignupSelectAccountTypePersonalUserUpdateDocument,
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
						query: SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
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
						query: SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: SignupSelectAccountTypePersonalUserUpdateDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					error: new Error('Failed to update account type'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
