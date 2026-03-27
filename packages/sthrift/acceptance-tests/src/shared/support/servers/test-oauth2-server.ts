import { apiSettings, uiSettings } from '../local-settings.ts';
import { PortlessServer } from './portless-server.ts';

// OAuth2 mock server via portless
export class TestOAuth2Server extends PortlessServer {
	protected get probeUrl() { return `${apiSettings.userPortalOidcIssuer}/.well-known/jwks.json`; }
	protected get readyMarker() { return 'Mock OAuth2 server running'; }
	protected get serverName() { return 'TestOAuth2Server'; }
	protected get startupTimeoutMs() { return 30_000; }
	protected get spawnArgs() { return ['mock-auth.sharethrift.localhost', 'node', 'dist/src/index.js']; }
	protected get cwd() { return apiSettings.oauth2MockDir; }

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
		return apiSettings.userPortalOidcIssuer;
	}

	async generateAccessToken(audience = 'user-portal'): Promise<string> {
		const issuer = apiSettings.userPortalOidcIssuer;

		const redirectUri =
			audience === 'admin-portal'
				? uiSettings.adminRedirectUri
				: uiSettings.redirectUri;

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
}

