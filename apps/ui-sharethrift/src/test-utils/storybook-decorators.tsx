import { type ReactNode, type ReactElement, useMemo } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from 'react-oidc-context';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import type { Decorator, StoryContext } from '@storybook/react';
import { createMockAuth, createMockUser } from '../test/utils/mockAuth.ts';

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
export const withMockApolloClient: Decorator = (Story, context: StoryContext) => {
	const mocks = context.parameters?.['apolloClient']?.['mocks'] || [];
	const showWarnings = context.parameters?.['apolloClient']?.['showWarnings'] ?? false;
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
 * Mock authentication wrapper component for Storybook stories.
 * Provides a mocked AuthContext that simulates an authenticated user.
 *
 * NOTE: We cannot use AuthProvider directly because it requires a real OIDC server.
 * AuthProvider from react-oidc-context attempts to connect to the authority URL,
 * perform OAuth2/OIDC flows, and validate tokens. Since we're using a fake authority
 * in Storybook, the authentication fails and useAuth() returns isAuthenticated: false.
 * Instead, we use AuthContext.Provider directly with a mocked auth object.
 *
 * When any child component calls useAuth(), it uses React's useContext(AuthContext) internally.
 * By wrapping with <AuthContext.Provider value={mockAuth}>, we provide the mock data to
 * that context, so components receive our mockAuth object with isAuthenticated: true.
 *
 * IMPLEMENTATION NOTE: This component uses createMockAuth() and createMockUser() utilities
 * from '../test/utils/mockAuth.ts' instead of manually constructing the auth object.
 * This eliminates TypeScript 'any' types, ensures type safety, and reuses the shared
 * mock implementation that properly types all required OIDC fields (profile, tokens, events, etc.).
 */
export const MockAuthWrapper = ({
	children,
}: {
	children: ReactNode;
}): ReactElement => {
	const mockAuth = useMemo(
		() =>
			createMockAuth({
				isAuthenticated: true,
				user: createMockUser(),
			}),
		[],
	);

	return (
		<AuthContext.Provider value={mockAuth}>{children}</AuthContext.Provider>
	);
};

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
	(initialRoute = '/'): Decorator =>
	(Story) => (
		<MockAuthWrapper>
			<MemoryRouter initialEntries={[initialRoute]}>
				<Routes>
					<Route path="*" element={<Story />} />
				</Routes>
			</MemoryRouter>
		</MockAuthWrapper>
	);
