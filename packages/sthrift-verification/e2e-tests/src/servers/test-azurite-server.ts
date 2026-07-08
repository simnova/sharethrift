import { ProcessTestServer } from '@cellix/serenity-framework/servers';
import { appPaths } from '../shared/environment/app-paths.ts';

export const testAzuriteServer = new ProcessTestServer({
	cwd: appPaths.apiDir,
	executable: 'pnpm',
	portsToCloseBeforeStart: [10_000, 10_001, 10_002],
	readyMarker: '[azurite] started',
	serverName: 'TestAzuriteServer',
	spawnArgs: ['run', 'azurite'],
	url: 'http://127.0.0.1:10000',
});
