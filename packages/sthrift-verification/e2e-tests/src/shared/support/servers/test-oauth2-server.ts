import { apiSettings } from '@sthrift-verification/verification-shared/settings';
import { PortlessServer } from './portless-server.ts';
import { buildUrl } from './test-environment.ts';

// OAuth2 mock server via portless
// Claims are now driven by mock-oidc.json files in each ui-* app directory,
// not by environment variables passed at startup.
export class TestOAuth2Server extends PortlessServer {
	protected get probeUrl() {
		return `${this.getPortalUrl('user-portal')}/.well-known/jwks.json`;
	}
	protected get readyMarker() {
		return 'Registered portal: user-portal';
	}
	protected get serverName() {
		return 'TestOAuth2Server';
	}
	protected get startupTimeoutMs() {
		return 30_000;
	}
	protected get spawnArgs() {
		return [
			'--force',
			'mock-auth.sharethrift.localhost',
			'node',
			'dist/src/index.js',
		];
	}
	protected get cwd() {
		return apiSettings.oauth2MockDir;
	}

	protected override get extraEnv() {
		return {
			BASE_URL: buildUrl('mock-auth.sharethrift.localhost'),
		};
	}

	getUrl(): string {
		return buildUrl('mock-auth.sharethrift.localhost');
	}

	private getPortalUrl(portal: 'user-portal' | 'admin-portal'): string {
		return `${this.getUrl()}/${portal}`;
	}

	async generateAccessToken(audience = 'user-portal'): Promise<string> {
		const portal = audience === 'admin-portal' ? 'admin-portal' : 'user-portal';
		const issuer = this.getPortalUrl(portal);
		const uiBaseUrl = buildUrl('sharethrift.localhost');

		const redirectUri =
			audience === 'admin-portal'
				? `${uiBaseUrl}/auth-redirect-admin`
				: `${uiBaseUrl}/auth-redirect-user`;

		const code = `mock-auth-code-${Buffer.from(
			JSON.stringify({ redirectUri }),
		).toString('base64')}`;

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
