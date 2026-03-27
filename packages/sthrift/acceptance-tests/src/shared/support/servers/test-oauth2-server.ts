import { localSettings } from '../local-settings.ts';
import { PortlessServer } from './portless-server.ts';

// OAuth2 mock server via portless, reuses existing instance or starts fresh
export class TestOAuth2Server extends PortlessServer {
	protected get probeUrl() { return `${localSettings.oauthIssuerUrl}/.well-known/jwks.json`; }
	protected get readyMarker() { return 'Mock OAuth2 server running'; }
	protected get serverName() { return 'TestOAuth2Server'; }
	protected get startupTimeoutMs() { return 30_000; }
	protected get spawnArgs() { return ['mock-auth.sharethrift.localhost', 'node', 'dist/src/index.js']; }
	protected get cwd() { return localSettings.oauth2MockDir; }

	private readonly testUser: {
		email: string;
		given_name: string;
		family_name: string;
	};

	constructor(options?: {
		testUser?: {
			email?: string;
			given_name?: string;
			family_name?: string;
		};
	}) {
		super();
		this.testUser = {
			email: options?.testUser?.email ?? 'alice@test.sharethrift.com',
			given_name: options?.testUser?.given_name ?? 'Alice',
			family_name: options?.testUser?.family_name ?? 'Test',
		};
	}

	protected override get extraEnv() {
		return {
			EMAIL: this.testUser.email,
			GIVEN_NAME: this.testUser.given_name,
			FAMILY_NAME: this.testUser.family_name,
		};
	}

	// Probe via JWKS endpoint
	override async isAlreadyRunning(): Promise<boolean> {
		try {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 3_000);
			const res = await fetch(this.probeUrl, { signal: controller.signal });
			clearTimeout(timeout);
			return res.ok;
		} catch {
			return false;
		}
	}

	getUrl(): string {
		return localSettings.oauthIssuerUrl;
	}

	// Obtain access token from mock /token endpoint
	async generateAccessToken(audience = 'user-portal'): Promise<string> {
		const issuer = localSettings.oauthIssuerUrl;

		const redirectUri =
			audience === 'admin-portal'
				? localSettings.uiAdminRedirectUri
				: localSettings.uiRedirectUri;

		const code = `mock-auth-code-${Buffer.from(redirectUri).toString('base64')}`;

		const response = await fetch(`${issuer}/token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ code, grant_type: 'authorization_code' }),
		});

		if (!response.ok) {
			throw new Error(
				`Token request failed: ${response.status} ${await response.text()}`,
			);
		}

		const data = (await response.json()) as { access_token: string };
		return data.access_token;
	}

	// Generate OIDC user session for sessionStorage injection
	async generateOidcUserSession(
		clientId?: string,
	): Promise<{ storageKey: string; storageValue: string }> {
		const issuer = localSettings.oauthIssuerUrl;
		const resolvedClientId = clientId ?? localSettings.uiClientId;

		const code = `mock-auth-code-${Buffer.from(localSettings.uiRedirectUri).toString('base64')}`;

		const response = await fetch(`${issuer}/token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ code, grant_type: 'authorization_code' }),
		});

		if (!response.ok) {
			throw new Error(
				`Token request failed: ${response.status} ${await response.text()}`,
			);
		}

		const data = (await response.json()) as {
			id_token: string;
			access_token: string;
			profile: Record<string, unknown>;
			expires_at: number;
		};

		const storageKey = `oidc.user:${issuer}:${resolvedClientId}`;
		const storageValue = JSON.stringify({
			id_token: data.id_token,
			access_token: data.access_token,
			token_type: 'Bearer',
			scope: localSettings.uiScope,
			profile: data.profile,
			expires_at: data.expires_at,
			session_state: null,
		});

		return { storageKey, storageValue };
	}
}

