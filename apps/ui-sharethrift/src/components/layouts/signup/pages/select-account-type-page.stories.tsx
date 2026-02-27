import type { Meta, StoryObj } from '@storybook/react';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import {
	SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
	SelectAccountTypeContainerAccountPlansDocument,
} from '../../../../generated.tsx';
import { SignupRoutes } from '../index.tsx';
import { mockAccountPlans } from '../../../../test-utils/storybook-mock-helpers.ts';

const meta: Meta<typeof SignupRoutes> = {
	title: 'Pages/Signup/Select Account Type',
	component: SignupRoutes,
  parameters: {
    layout: 'fullscreen',
  },
	decorators: [
		withMockApolloClient,
		withMockRouter('/select-account-type'),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Simple story that renders the page wrapper component
// The page just returns <SelectAccountTypeContainer />, so this will test the wrapper's return statement
export const Default: Story = {
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
							currentPersonalUserAndCreateIfNotExists: {
								__typename: 'PersonalUser',
								id: 'mock-user-id-1',
								account: {
									__typename: 'PersonalUserAccount',
									accountType: 'non-verified-personal',
								},
							},
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
};
