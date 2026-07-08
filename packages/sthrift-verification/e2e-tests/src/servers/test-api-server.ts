import { ProcessTestServer } from '@cellix/serenity-framework/servers';
import { appPaths } from '../shared/environment/app-paths.ts';
import { buildUrl, hostnames } from '../shared/environment/test-environment.ts';

export const testApiServer = new ProcessTestServer({
	cwd: appPaths.apiDir,
	executable: 'pnpm',
	readyMarker: 'Functions:',
	serverName: 'TestApiServer',
	spawnArgs: ['run', 'dev'],
	url: buildUrl(hostnames.api, '/api/graphql'),
});
