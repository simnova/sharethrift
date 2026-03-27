import { apiSettings } from '../local-settings.ts';
import { PortlessServer } from './portless-server.ts';

// Azure Functions API via portless
export class TestApiServer extends PortlessServer {
	protected get probeUrl() { return apiSettings.apiGraphqlUrl; }
	protected get readyMarker() { return 'Functions:'; }
	protected get serverName() { return 'TestApiServer'; }
	protected get startupTimeoutMs() { return 120_000; }
	protected get spawnArgs() { return ['data-access.sharethrift.localhost', 'node', 'start-dev.mjs']; }
	protected get cwd() { return apiSettings.apiDir; }

	protected override get extraEnv() {
		return {
			languageWorkers__node__arguments: '', // Avoid debug inspector port conflict
		};
	}

	getUrl(): string {
		return apiSettings.apiGraphqlUrl;
	}
}
