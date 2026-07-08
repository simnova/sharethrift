import { ProcessUiTestServer } from '@cellix/serenity-framework/servers';
import { appPaths } from '../shared/environment/app-paths.ts';
import { buildUrl, hostnames } from '../shared/environment/test-environment.ts';

export const uiShareThriftPortalServer = new ProcessUiTestServer({
	cwd: appPaths.uiShareThriftDir,
	executable: 'pnpm',
	readyMarker: 'ready in',
	serverName: 'TestShareThriftViteServer',
	spawnArgs: ['run', 'dev'],
	url: buildUrl(hostnames.ui),
});
