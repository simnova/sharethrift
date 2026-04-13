import type { AuthContextProps } from 'react-oidc-context';

interface MockUser {
	profile: {
		sub: string;
		iss: string;
		aud: string;
		exp: number;
		iat: number;
		[key: string]: unknown;
	};
	session_state: string | null;
	access_token: string;
	token_type: string;
	state: string | null;
	scope: string;
	expires_at: number;
	id_token: string;
	expires_in: number;
	expired: boolean;
	scopes: string[];
	toStorageString(): string;
}

class MockUserImpl implements MockUser {
	profile: {
		sub: string;
		iss: string;
		aud: string;
		exp: number;
		iat: number;
		[key: string]: unknown;
	};
	session_state: string | null = null;
	access_token = 'mock-access-token';
	token_type = 'Bearer';
	state: string | null = null;
	scope = 'openid profile email';
	expires_at = Date.now() / 1000 + 3600;
	id_token = 'mock-id-token';
	expires_in = 3600;
	expired = false;
	scopes = ['openid', 'profile', 'email'];

	constructor(data: { profile: Record<string, unknown> }) {
		this.profile = data.profile as {
			sub: string;
			iss: string;
			aud: string;
			exp: number;
			iat: number;
			[key: string]: unknown;
		};
	}

	toStorageString(): string {
		return JSON.stringify({
			profile: this.profile,
			access_token: this.access_token,
			id_token: this.id_token,
		});
	}
}

export function createMockUser(
	profile: Partial<Record<string, unknown>> = {},
): MockUser {
	const nowInSeconds = Math.floor(Date.now() / 1000);
	return new MockUserImpl({
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

const noop = () => undefined;
const noopAsync = async () => undefined;

const baseMock: AuthContextProps = {
	isAuthenticated: false,
	isLoading: false,
	user: undefined,
	error: undefined,
	activeNavigator: undefined,
	signinRedirect: noopAsync,
	signoutRedirect: noopAsync,
	removeUser: noopAsync,
	clearStaleState: noopAsync,
	signinPopup: async () => createMockUser(),
	signinSilent: async () => createMockUser(),
	signinResourceOwnerCredentials: async () => createMockUser(),
	signoutPopup: noopAsync,
	signoutSilent: noopAsync,
	querySessionStatus: async () => null,
	revokeTokens: noopAsync,
	startSilentRenew: noop,
	stopSilentRenew: noop,
	events: {
		addAccessTokenExpiring: () => noop,
		addAccessTokenExpired: () => noop,
		addSilentRenewError: () => noop,
		addUserLoaded: () => noop,
		addUserUnloaded: () => noop,
		addUserSignedIn: () => noop,
		addUserSignedOut: () => noop,
		addUserSessionChanged: () => noop,
		removeAccessTokenExpiring: noop,
		removeAccessTokenExpired: noop,
		removeSilentRenewError: noop,
		removeUserLoaded: noop,
		removeUserUnloaded: noop,
		removeUserSignedIn: noop,
		removeUserSignedOut: noop,
		removeUserSessionChanged: noop,
	} as unknown as AuthContextProps['events'],
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
