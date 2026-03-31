import { apiSettings } from '../local-settings.ts';
import { PortlessServer } from './portless-server.ts';
import { buildUrl } from './test-environment.ts';

// UI dev server via portless
export class TestViteServer extends PortlessServer {
	protected get probeUrl() { return buildUrl('sharethrift.localhost'); }
	protected get readyMarker() { return 'ready in'; }
	protected get serverName() { return 'TestViteServer'; }
	protected get startupTimeoutMs() { return 60_000; }
	protected get spawnArgs() { return ['sharethrift.localhost', 'pnpm', 'exec', 'vite']; }
	protected get cwd() { return apiSettings.uiDir; }

	protected override get extraEnv() {
		const oauthAuthority = buildUrl('mock-auth.sharethrift.localhost');
		const uiBase = buildUrl('sharethrift.localhost');
		const apiEndpoint = buildUrl('data-access.sharethrift.localhost', '/api/graphql');

		return {
			BROWSER: 'none',
			VITE_BASE_URL: uiBase,
			VITE_B2C_AUTHORITY: oauthAuthority,
			VITE_B2C_REDIRECT_URI: `${uiBase}/auth-redirect-user`,
			VITE_FUNCTION_ENDPOINT: apiEndpoint,
			VITE_B2C_ADMIN_AUTHORITY: oauthAuthority,
			VITE_B2C_ADMIN_REDIRECT_URI: `${uiBase}/auth-redirect-admin`,
		};
	}

	getUrl(): string {
		return buildUrl('sharethrift.localhost');
	}
}
