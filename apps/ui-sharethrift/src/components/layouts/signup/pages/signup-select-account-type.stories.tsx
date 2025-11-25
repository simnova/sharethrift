import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { SignupSelectAccountType } from './signup-select-account-type';
import { withMockApolloClient, withMockRouter } from '../../../../test-utils/storybook-decorators.tsx';
import {
	SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
	SignupSelectAccountTypePersonalUserUpdateDocument,
} from '../../../../generated.tsx';

const meta: Meta<typeof SignupSelectAccountType> = {
	title: 'Pages/SignupSelectAccountType',
	component: SignupSelectAccountType,
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
							currentPersonalUser: {
								__typename: 'PersonalUser',
								id: 'user-new',
								email: 'test@example.com',
								firstName: null,
								lastName: null,
								username: null,
								accountType: null,
							},
						},
					},
				},
				{
					request: {
						query: SignupSelectAccountTypePersonalUserUpdateDocument,
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
								personalUser: {
									__typename: 'PersonalUser',
									id: 'user-new',
									email: 'test@example.com',
									firstName: 'John',
									lastName: 'Doe',
									username: 'johndoe',
									accountType: 'verified-personal',
								},
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/signup/select-account')],
};

export default meta;
type Story = StoryObj<typeof SignupSelectAccountType>;

export const Default: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
