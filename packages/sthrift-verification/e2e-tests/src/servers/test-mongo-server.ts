import { ProcessTestServer } from '@cellix/serenity-framework/servers';
import { appPaths } from '../shared/environment/app-paths.ts';

export const testMongoServer = new ProcessTestServer({
	cwd: appPaths.mongodbMemoryMockDir,
	dbName: 'sharethrift',
	executable: 'pnpm',
	portsToCloseBeforeStart: 50_000,
	readyMarker: 'MongoDB Memory Replica Set ready at:',
	serverName: 'TestMongoMemoryServer',
	spawnArgs: ['run', 'dev'],
	url: 'mongodb://127.0.0.1:50000/sharethrift?replicaSet=globaldb',
});
