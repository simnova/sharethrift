import type { AuthContextProps } from 'react-oidc-context';

// Mock User interface to match what react-oidc-context expects
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

// Mock User class to avoid dependency on oidc-client-ts
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
	access_token: string = 'mock-access-token';
	token_type: string = 'Bearer';
	state: string | null = null;
	scope: string = 'openid profile email';
	expires_at: number = Date.now() / 1000 + 3600;
	id_token: string = 'mock-id-token';
	expires_in: number = 3600;
	expired: boolean = false;
	scopes: string[] = ['openid', 'profile', 'email'];

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
	events: {
		addAccessTokenExpiring: () => () => {
			/* mock event handler */
		},
		addAccessTokenExpired: () => () => {
			/* mock event handler */
		},
		addSilentRenewError: () => () => {
			/* mock event handler */
		},
		addUserLoaded: () => () => {
			/* mock event handler */
		},
		addUserUnloaded: () => () => {
			/* mock event handler */
		},
		addUserSignedIn: () => () => {
			/* mock event handler */
		},
		addUserSignedOut: () => () => {
			/* mock event handler */
		},
		addUserSessionChanged: () => () => {
			/* mock event handler */
		},
		removeAccessTokenExpiring: () => {
			/* mock event handler */
		},
		removeAccessTokenExpired: () => {
			/* mock event handler */
		},
		removeSilentRenewError: () => {
			/* mock event handler */
		},
		removeUserLoaded: () => {
			/* mock event handler */
		},
		removeUserUnloaded: () => {
			/* mock event handler */
		},
		removeUserSignedIn: () => {
			/* mock event handler */
		},
		removeUserSignedOut: () => {
			/* mock event handler */
		},
		removeUserSessionChanged: () => {
			/* mock event handler */
		},
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
