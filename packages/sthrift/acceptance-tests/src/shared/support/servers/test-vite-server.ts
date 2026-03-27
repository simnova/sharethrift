import { localSettings } from '../local-settings.ts';
import { PortlessServer } from './portless-server.ts';

// UI dev server via portless (reuses existing instance if running)
export class TestViteServer extends PortlessServer {
	protected get probeUrl() { return localSettings.uiUrl; }
	protected get readyMarker() { return 'ready in'; }
	protected get serverName() { return 'TestViteServer'; }
	protected get startupTimeoutMs() { return 60_000; }
	protected get spawnArgs() { return ['sharethrift.localhost', 'vite']; }
	protected get cwd() { return localSettings.uiDir; }

	getUrl(): string {
		return localSettings.uiUrl;
	}
}
