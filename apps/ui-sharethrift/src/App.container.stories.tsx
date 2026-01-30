import type { Meta, StoryObj } from '@storybook/react';
import { AppContainer } from './app.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
	MockUnauthWrapper,
} from './test-utils/storybook-decorators.tsx';
import { AppContainerCurrentUserDocument } from './generated.tsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const meta: Meta<typeof AppContainer> = {
	title: 'App/AppContainer',
	component: AppContainer,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock for authenticated user who has completed onboarding
const mockAuthenticatedCompletedOnboarding = {
	request: {
		query: AppContainerCurrentUserDocument,
		variables: {},
	},
	result: {
		data: {
			currentUser: {
				__typename: 'PersonalUser' as const,
				id: 'user-123',
				userType: 'personal-user',
				hasCompletedOnboarding: true,
			},
		},
	},
};

// Mock for authenticated user who hasn't completed onboarding
const mockAuthenticatedNotCompletedOnboarding = {
	request: {
		query: AppContainerCurrentUserDocument,
		variables: {},
	},
	result: {
		data: {
			currentUserAndCreateIfNotExists: {
				__typename: 'PersonalUser' as const,
				id: 'user-456',
				userType: 'personal-user',
				hasCompletedOnboarding: false,
			},
		},
	},
};

export const AuthenticatedCompletedOnboarding: Story = {
	decorators: [withMockApolloClient, withMockRouter('/')],
	parameters: {
		apolloClient: {
			mocks: [mockAuthenticatedCompletedOnboarding],
		},
	},
};

export const AuthenticatedNotCompletedOnboarding: Story = {
	decorators: [withMockApolloClient, withMockRouter('/')],
	parameters: {
		apolloClient: {
			mocks: [mockAuthenticatedNotCompletedOnboarding],
		},
	},
};

export const Unauthenticated: Story = {
	decorators: [
		withMockApolloClient,
		(Story) => (
			<MockUnauthWrapper>
				<MemoryRouter initialEntries={['/']}>
					<Routes>
						<Route path="*" element={<Story />} />
					</Routes>
				</MemoryRouter>
			</MockUnauthWrapper>
		),
	],
	parameters: {
		apolloClient: {
			mocks: [],
		},
	},
};
