import type { Meta, StoryObj } from '@storybook/react';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import {
	TermsContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
	type PersonalUser,
} from '../../../../generated.tsx';
import { App } from '../../../../App.tsx';

const meta: Meta<typeof App> = {
	title: 'Pages/Signup/Terms',
	component: App,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [withMockApolloClient, withMockRouter('/signup/terms')],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPersonalUser: PersonalUser = {
	id: '507f1f77bcf86cd799439099',
	hasCompletedOnboarding: false,
	userType: 'personal-user',
	account: {
		accountType: 'non-verified-personal',
	},
};

export const Default: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query:
							TermsContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockPersonalUser,
						},
					},
				},
			],
		},
	},
};
