import type { AuthContextProps } from 'react-oidc-context';

// Mock User class to avoid dependency on oidc-client-ts
class MockUser {
	profile: Record<string, unknown>;
	
	constructor(data: { profile: Record<string, unknown> }) {
		this.profile = data.profile;
	}
}

export function createMockUser(profile: Partial<Record<string, unknown>> = {}): MockUser {
	const nowInSeconds = Math.floor(Date.now() / 1000);
	return new MockUser({
		profile: {
			sub: '507f1f77bcf86cd799439099',
			name: 'Test User',
			email: 'test@example.com',
			iss: 'https://mock-authority.com',
			aud: 'storybook-client',
			exp: nowInSeconds + 3600,
			iat: nowInSeconds,
			...profile,
		},
	});
}

const baseMock: AuthContextProps = {
	isAuthenticated: false,
	isLoading: false,
	user: undefined,
	error: undefined,
	activeNavigator: undefined,
	signinRedirect: async () => {
		/* mock implementation */
	},
	signoutRedirect: async () => {
		/* mock implementation */
	},
	removeUser: async () => {
		/* mock implementation */
	},
	clearStaleState: async () => {
		/* mock implementation */
	},
	signinPopup: async () => createMockUser(),
	signinSilent: async () => createMockUser(),
	signinResourceOwnerCredentials: async () => createMockUser(),
	signoutPopup: async () => {
		/* mock implementation */
	},
	signoutSilent: async () => {
		/* mock implementation */
	},
	querySessionStatus: async () => null,
	revokeTokens: async () => {
		/* mock implementation */
	},
	startSilentRenew: () => {
		/* mock implementation */
	},
	stopSilentRenew: () => {
		/* mock implementation */
	},
	events: {} as AuthContextProps['events'],
	settings: {
		authority: 'https://mock-authority.com',
		client_id: 'storybook-client',
		redirect_uri: 'http://localhost',
	} as AuthContextProps['settings'],
};

export function createMockAuth(
	overrides: Partial<AuthContextProps> = {},
): AuthContextProps {
	return { ...baseMock, ...overrides };
}
