import { type ReactElement, type ReactNode, useMemo } from 'react';
import { AuthContext } from 'react-oidc-context';
import { createMockAuth, createMockUser } from '../test/utils/mockAuth.ts';

/**
 * Mock unauthenticated wrapper component for Storybook stories.
 * Provides a mocked AuthContext that simulates an unauthenticated user.
 *
 * Use this when testing components that show different UI for logged-out users
 * (e.g., Login/Sign Up buttons in headers).
 */
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

	return (
		<AuthContext.Provider value={mockAuth}>{children}</AuthContext.Provider>
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

  return <AuthContext.Provider value={mockAuth}>{children}</AuthContext.Provider>;
};
