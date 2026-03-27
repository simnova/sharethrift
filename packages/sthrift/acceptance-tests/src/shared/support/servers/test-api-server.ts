import { localSettings } from '../local-settings.ts';
import { PortlessServer } from './portless-server.ts';

// Azure Functions API via portless (reads local.settings.json directly)
export class TestApiServer extends PortlessServer {
	protected get probeUrl() { return localSettings.apiGraphqlUrl; }
	protected get readyMarker() { return 'Functions:'; }
	protected get serverName() { return 'TestApiServer'; }
	protected get startupTimeoutMs() { return 120_000; }
	protected get spawnArgs() { return ['data-access.sharethrift.localhost', 'node', 'start-dev.mjs']; }
	protected get cwd() { return localSettings.apiDir; }

	protected override get extraEnv() {
		return {
			languageWorkers__node__arguments: '', // Avoid debug inspector port conflict
		};
	}

	getUrl(): string {
		return localSettings.apiGraphqlUrl;
	}
}
