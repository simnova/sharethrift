import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import type { Decorator, StoryContext } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserIdProvider } from '../components/shared/user-context.tsx';
import { MockAuthWrapper } from './storybook-mock-auth-wrappers.tsx';

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
