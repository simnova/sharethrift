import type { Meta, StoryObj } from '@storybook/react';
import { expect, waitFor } from 'storybook/test';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useApolloClient } from '@apollo/client/react';
import { useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { useUserId } from '../components/shared/user-context.tsx';
import {
	withMockApolloClient,
	withMockUserId,
	withMockRouter,
	withAuthDecorator,
} from './storybook-decorators.tsx';

// Test component to verify Apollo Client is provided
const ApolloTestComponent = () => {
	const client = useApolloClient();
	return (
		<div data-testid="apollo-test">
			{client ? 'Apollo Client Connected' : 'No Apollo Client'}
		</div>
	);
};

// Test component to verify userId is provided
const UserIdTestComponent = () => {
	const userId = useUserId();
	return <div data-testid="userid-test">{userId || 'No User ID'}</div>;
};

// Test component to verify router is provided
const RouterTestComponent = () => {
	const location = useLocation();
	return (
		<div data-testid="router-test">
			Current Path: {location.pathname}
		</div>
	);
};

// Test component to verify auth context is provided
const AuthTestComponent = () => {
	return <div data-testid="auth-test">Auth Provider Active</div>;
};

const TEST_QUERY = gql`
	query TestQuery {
		test
	}
`;

// Test component to verify Apollo mocks are exercised
const ApolloQueryTestComponent = () => {
	const { data, loading, error } = useQuery<{ test: string }>(TEST_QUERY);

	if (loading) {
		return <div data-testid="apollo-query">Loading</div>;
	}

	if (error) {
		return <div data-testid="apollo-query">Error</div>;
	}

	return <div data-testid="apollo-query">{data?.test ?? 'No Data'}</div>;
};

// Test component to verify auth context values are provided
const AuthStateTestComponent = () => {
	const { isAuthenticated, user } = useAuth();
	const label = isAuthenticated
		? `Authenticated:${user?.profile?.sub ?? 'unknown'}`
		: 'Unauthenticated';
	return <div data-testid="auth-state">{label}</div>;
};

const meta: Meta = {
	title: 'Test Utils/Storybook Decorators',
	parameters: {
		layout: 'centered',
	},
	tags: ['!dev'], // functional testing story, not rendered in sidebar
};

export default meta;
type Story = StoryObj;

/**
 * Test withMockApolloClient decorator
 * Verifies that the Apollo Client is properly initialized and provided
 */
export const WithMockApolloClient: Story = {
	decorators: [withMockApolloClient],
	render: () => <ApolloTestComponent />,
	parameters: {
		apolloClient: {
			mocks: [],
			showWarnings: false,
		},
	},
	play: ({ canvasElement }) => {
		const apolloTest = canvasElement.querySelector('[data-testid="apollo-test"]');
		expect(apolloTest).toBeTruthy();
		expect(apolloTest?.textContent).toBe('Apollo Client Connected');
	},
};

/**
 * Test withMockApolloClient with custom mocks
 * Verifies that mocks are properly passed to the Apollo Client
 */
export const WithMockApolloClientAndMocks: Story = {
	decorators: [withMockApolloClient],
	render: () => <ApolloTestComponent />,
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: TEST_QUERY,
					},
					result: {
						data: { test: 'test data' },
					},
				},
			],
			showWarnings: true,
		},
	},
	play: ({ canvasElement }) => {
		const apolloTest = canvasElement.querySelector('[data-testid="apollo-test"]');
		expect(apolloTest).toBeTruthy();
		expect(apolloTest?.textContent).toBe('Apollo Client Connected');
	},
};

/**
 * Test withMockApolloClient executes queries using mocks
 * Verifies that the mocked response resolves through Apollo Client
 */
export const WithMockApolloClientQuery: Story = {
	decorators: [withMockApolloClient],
	render: () => <ApolloQueryTestComponent />,
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: TEST_QUERY,
					},
					result: {
						data: { test: 'mocked-result' },
					},
				},
			],
			showWarnings: false,
		},
	},
	play: async ({ canvasElement }) => {
		await waitFor(() =>
			expect(
				canvasElement.querySelector('[data-testid="apollo-query"]')
					?.textContent,
			).toBe('mocked-result'),
		);
	},
};

/**
 * Test withMockApolloClient without parameters
 * Verifies default behavior when no apolloClient parameters are provided
 */
export const WithMockApolloClientNoParams: Story = {
	decorators: [withMockApolloClient],
	render: () => <ApolloTestComponent />,
	play: ({ canvasElement }) => {
		const apolloTest = canvasElement.querySelector('[data-testid="apollo-test"]');
		expect(apolloTest).toBeTruthy();
		expect(apolloTest?.textContent).toBe('Apollo Client Connected');
	},
};

/**
 * Test withMockUserId decorator with default userId
 * Verifies that the default user ID ('user-1') is provided
 */
export const WithMockUserIdDefault: Story = {
	decorators: [withMockUserId()],
	render: () => <UserIdTestComponent />,
	play: ({ canvasElement }) => {
		const userIdTest = canvasElement.querySelector('[data-testid="userid-test"]');
		expect(userIdTest).toBeTruthy();
		expect(userIdTest?.textContent).toBe('user-1');
	},
};

/**
 * Test withMockUserId decorator with custom userId
 * Verifies that a custom user ID is properly provided
 */
export const WithMockUserIdCustom: Story = {
	decorators: [withMockUserId('custom-user-123')],
	render: () => <UserIdTestComponent />,
	play: ({ canvasElement }) => {
		const userIdTest = canvasElement.querySelector('[data-testid="userid-test"]');
		expect(userIdTest).toBeTruthy();
		expect(userIdTest?.textContent).toBe('custom-user-123');
	},
};

/**
 * Test withMockRouter decorator with default route
 * Verifies that the router is initialized with the default route ('/')
 */
export const WithMockRouterDefault: Story = {
	decorators: [withMockRouter()],
	render: () => <RouterTestComponent />,
	play: ({ canvasElement }) => {
		const routerTest = canvasElement.querySelector('[data-testid="router-test"]');
		expect(routerTest).toBeTruthy();
		expect(routerTest?.textContent).toContain('Current Path: /');
	},
};

/**
 * Test withMockRouter decorator with custom route
 * Verifies that the router is initialized with a custom route
 */
export const WithMockRouterCustomRoute: Story = {
	decorators: [withMockRouter('/account/profile')],
	render: () => <RouterTestComponent />,
	play: ({ canvasElement }) => {
		const routerTest = canvasElement.querySelector('[data-testid="router-test"]');
		expect(routerTest).toBeTruthy();
		expect(routerTest?.textContent).toContain('Current Path: /account/profile');
	},
};

/**
 * Test withMockRouter decorator with authenticated user
 * Verifies that the router works with authentication enabled (default)
 */
export const WithMockRouterAuthenticated: Story = {
	decorators: [withMockRouter('/home', true)],
	render: () => (
		<div>
			<RouterTestComponent />
			<AuthStateTestComponent />
		</div>
	),
	play: ({ canvasElement }) => {
		const routerTest = canvasElement.querySelector('[data-testid="router-test"]');
		const authState = canvasElement.querySelector('[data-testid="auth-state"]');
		expect(routerTest).toBeTruthy();
		expect(routerTest?.textContent).toContain('Current Path: /home');
		expect(authState).toBeTruthy();
		expect(authState?.textContent).toContain('Authenticated:');
	},
};

/**
 * Test withMockRouter decorator with unauthenticated user
 * Verifies that the router works with authentication disabled
 */
export const WithMockRouterUnauthenticated: Story = {
	decorators: [withMockRouter('/login', false)],
	render: () => (
		<div>
			<RouterTestComponent />
			<AuthStateTestComponent />
		</div>
	),
	play: ({ canvasElement }) => {
		const routerTest = canvasElement.querySelector('[data-testid="router-test"]');
		const authState = canvasElement.querySelector('[data-testid="auth-state"]');
		expect(routerTest).toBeTruthy();
		expect(routerTest?.textContent).toContain('Current Path: /login');
		expect(authState).toBeTruthy();
		expect(authState?.textContent).toBe('Unauthenticated');
	},
};

/**
 * Test withAuthDecorator
 * Verifies that the auth decorator properly wraps components
 */
export const WithAuthDecorator: Story = {
	decorators: [withAuthDecorator],
	render: () => <AuthTestComponent />,
	play: ({ canvasElement }) => {
		const authTest = canvasElement.querySelector('[data-testid="auth-test"]');
		expect(authTest).toBeTruthy();
		expect(authTest?.textContent).toBe('Auth Provider Active');
	},
};

/**
 * Test combined decorators
 * Verifies that multiple decorators can be used together
 */
export const CombinedDecorators: Story = {
	decorators: [withMockApolloClient, withMockUserId('combined-user'), withMockRouter('/combined')],
	render: () => (
		<div>
			<ApolloTestComponent />
			<UserIdTestComponent />
			<RouterTestComponent />
		</div>
	),
	parameters: {
		apolloClient: {
			mocks: [],
		},
	},
	play: ({ canvasElement }) => {
		const apolloTest = canvasElement.querySelector('[data-testid="apollo-test"]');
		const userIdTest = canvasElement.querySelector('[data-testid="userid-test"]');
		const routerTest = canvasElement.querySelector('[data-testid="router-test"]');

		expect(apolloTest).toBeTruthy();
		expect(apolloTest?.textContent).toBe('Apollo Client Connected');

		expect(userIdTest).toBeTruthy();
		expect(userIdTest?.textContent).toBe('combined-user');

		expect(routerTest).toBeTruthy();
		expect(routerTest?.textContent).toContain('Current Path: /combined');
	},
};
