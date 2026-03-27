import { apiSettings, uiSettings } from '../local-settings.ts';
import { PortlessServer } from './portless-server.ts';

// UI dev server via portless
export class TestViteServer extends PortlessServer {
	protected get probeUrl() { return uiSettings.baseUrl; }
	protected get readyMarker() { return 'ready in'; }
	protected get serverName() { return 'TestViteServer'; }
	protected get startupTimeoutMs() { return 60_000; }
	protected get spawnArgs() { return ['sharethrift.localhost', 'pnpm', 'exec', 'vite']; }
	protected get cwd() { return apiSettings.uiDir; }
	protected override get extraEnv() { return { BROWSER: 'none' }; }

	getUrl(): string {
		return uiSettings.baseUrl;
	}
}
