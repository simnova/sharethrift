import type { Meta, StoryObj } from '@storybook/react';
import { AppContainer } from './App.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
	MockUnauthWrapper,
} from './test-utils/storybook-decorators.tsx';
import { AppContainerCurrentPersonalUserAndCreateIfNotExistsDocument } from './generated.tsx';
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
		query: AppContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
		variables: {},
	},
	result: {
		data: {
			currentPersonalUserAndCreateIfNotExists: {
				__typename: 'PersonalUser' as const,
				id: 'user-123',
				hasCompletedOnboarding: true,
			},
		},
	},
};

// Mock for authenticated user who hasn't completed onboarding
const mockAuthenticatedNotCompletedOnboarding = {
	request: {
		query: AppContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
		variables: {},
	},
	result: {
		data: {
			currentPersonalUserAndCreateIfNotExists: {
				__typename: 'PersonalUser' as const,
				id: 'user-456',
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
