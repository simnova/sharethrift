import { ProcessTestServer } from '@cellix/serenity-framework/servers';
import { appPaths } from '../shared/environment/app-paths.ts';
import { buildUrl } from '../shared/environment/test-environment.ts';

export const testMessagingServer = new ProcessTestServer({
	cwd: appPaths.messagingMockDir,
	executable: 'pnpm',
	readyMarker: 'Mock Messaging Server listening',
	serverName: 'TestMessagingServer',
	spawnArgs: ['run', 'dev'],
	url: buildUrl('mock-messaging.sharethrift.localhost'),
});
