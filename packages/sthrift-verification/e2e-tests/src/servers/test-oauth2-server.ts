import { ProcessTestServer } from '@cellix/serenity-framework/servers';
import { appPaths } from '../shared/environment/app-paths.ts';
import { buildUrl, hostnames } from '../shared/environment/test-environment.ts';

export const testOAuth2Server = new ProcessTestServer({
	cwd: appPaths.oauth2MockDir,
	executable: 'pnpm',
	readyMarker: 'Registered portal: user-portal',
	serverName: 'TestOAuth2Server',
	spawnArgs: ['run', 'dev'],
	url: buildUrl(hostnames.mockAuth, '/user-portal'),
});
