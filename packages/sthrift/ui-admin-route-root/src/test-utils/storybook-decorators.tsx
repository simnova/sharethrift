import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import type { Decorator, StoryContext } from '@storybook/react';
import { type ReactElement, type ReactNode, useMemo } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from 'react-oidc-context';
import { UserIdProvider } from '@sthrift/ui-shared';
import { createMockAuth, createMockUser } from './mock-auth.ts';

export const withMockApolloClient: Decorator = (
	Story,
	context: StoryContext,
) => {
	const mocks = context.parameters?.apolloClient?.mocks || [];
	const showWarnings = context.parameters?.apolloClient?.showWarnings ?? false;
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

	return <AuthContext.Provider value={mockAuth}>{children}</AuthContext.Provider>;
};

export const MockUnauthWrapper = ({
	children,
}: {
	children: ReactNode;
}): ReactElement => {
	const mockAuth = useMemo(
		() =>
			createMockAuth({
				isAuthenticated: false,
				user: null,
			}),
		[],
	);

	return <AuthContext.Provider value={mockAuth}>{children}</AuthContext.Provider>;
};

export const withMockUserId =
	(userId = 'user-1'): Decorator =>
	(Story) => (
		<UserIdProvider userId={userId}>
			<Story />
		</UserIdProvider>
	);

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
