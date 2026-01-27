import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import type { Decorator, StoryContext } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserIdProvider } from '../components/shared/user-context.tsx';
import { MockAuthWrapper } from './storybook-mock-auth-wrappers.tsx';
import { AuthProvider } from 'react-oidc-context';
import { MockedProvider } from '@apollo/client/testing/react';

/**
 * Reusable Apollo Client decorator for Storybook stories.
 * Reads mocks from story parameters and creates a MockLink-based Apollo Client.
 *
 * @example
 * ```tsx
 * export default {
 *   decorators: [withMockApolloClient],
 *   parameters: {
 *     apolloClient: {
 *       mocks: [{ request: {...}, result: {...} }],
 *       showWarnings: false,
 *     }
 *   }
 * } as Meta;
 * ```
 */
export const withMockApolloClient: Decorator = (
	Story,
	context: StoryContext,
) => {
	const mocks = context.parameters?.['apolloClient']?.['mocks'] || [];
	const showWarnings =
		context.parameters?.['apolloClient']?.['showWarnings'] ?? false;
	const mockLink = new MockLink(mocks, showWarnings);
	const client = new ApolloClient({
		link: mockLink,
		cache: new InMemoryCache(),
	});

	return (
		<ApolloProvider client={client}>
			<Story />
		</ApolloProvider>
	);
};

/**
 * Mock UserIdProvider wrapper for Storybook stories.
 * Provides a mocked user ID context for components that use useUserId().
 *
 * @param userId - The user ID to mock (defaults to 'user-1')
 * @returns A Storybook decorator function
 *
 * @example
 * ```tsx
 * export default {
 *   decorators: [
 *     withMockApolloClient,
 *     withMockUserId('user-123'),
 *   ],
 * } as Meta;
 * ```
 */
export const withMockUserId =
	(userId = 'user-1'): Decorator =>
	(Story) => (
		<UserIdProvider userId={userId}>
			<Story />
		</UserIdProvider>
	);

/**
 * Reusable Router decorator factory for Storybook stories.
 * Wraps stories with MemoryRouter, Routes, and MockAuthWrapper.
 *
 * @param initialRoute - The initial route to render (e.g., "/home", "/messages")
 * @returns A Storybook decorator function
 *
 * @example
 * ```tsx
 * export default {
 *   decorators: [
 *     withMockApolloClient,
 *     withMockRouter("/account/profile"),
 *   ],
 * } as Meta;
 * ```
 */
export const withMockRouter =
	(initialRoute = '/', isAuthenticated = true): Decorator =>
	(Story) => (
		<MockAuthWrapper isAuthenticated={isAuthenticated}>
			<MemoryRouter initialEntries={[initialRoute]}>
				<Routes>
					<Route path="*" element={<Story />} />
				</Routes>
			</MemoryRouter>
		</MockAuthWrapper>
	);

const mockEnv = {
	VITE_FUNCTION_ENDPOINT: 'https://mock-functions.example.com',
	VITE_BLOB_STORAGE_CONFIG_URL: 'https://mock-storage.example.com',
	VITE_B2C_AUTHORITY: 'https://mock-authority.example.com',
	VITE_B2C_CLIENTID: 'mock-client-id',
	NODE_ENV: 'development',
};

const mockStorage = {
	getItem: (key: string) => {
		if (key.includes('oidc.user')) {
			return JSON.stringify({
				access_token: '',
				profile: { sub: 'test-user' },
			});
		}
		return null;
	},
	setItem: () => Promise.resolve(),
	removeItem: () => Promise.resolve(),
	clear: () => Promise.resolve(),
	key: () => null,
	length: 0,
	set: () => Promise.resolve(),
	get: () => Promise.resolve(null),
	remove: () => Promise.resolve(null),
	getAllKeys: () => Promise.resolve([]),
};

// Apply mocks to global environment for stories
Object.defineProperty(globalThis, 'sessionStorage', {
	value: mockStorage,
	writable: true,
});
Object.defineProperty(globalThis, 'localStorage', {
	value: mockStorage,
	writable: true,
});

Object.defineProperty(import.meta, 'env', {
	value: mockEnv,
	writable: true,
});

// StoryFn's runtime signature can vary; accept `any` here so the
// decorator works regardless of Storybook's inferred types.
export const withAuthDecorator: Decorator = (Story) => (
	<MockedProvider mocks={[]}>
		<AuthProvider
			authority={mockEnv.VITE_B2C_AUTHORITY}
			client_id={mockEnv.VITE_B2C_CLIENTID}
			redirect_uri={globalThis.location.origin}
			post_logout_redirect_uri={globalThis.location.origin}
			userStore={mockStorage}
		>
			<Story />
		</AuthProvider>
	</MockedProvider>
);

export const mockEnvironment = { mockEnv, mockStorage };
