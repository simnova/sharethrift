import { GraphQLTestServer, MongoDBTestServer } from './servers/index.ts';
import { createRealApplicationServicesFactory } from './application-services/index.ts';
import { apiSettings } from './local-settings.ts';

// Shared infrastructure — persists across scenarios within a single test run
let mongoDBServer: MongoDBTestServer | undefined;
let mongoSeeded = false;
let graphQLServer: GraphQLTestServer | undefined;
let apiUrl: string | undefined;

export interface InfrastructureState {
	apiUrl: string | undefined;
}

export function getState(): InfrastructureState {
	return { apiUrl };
}

export async function stopAll(): Promise<void> {
	if (graphQLServer) { await graphQLServer.stop(); graphQLServer = undefined; }
	if (mongoDBServer) { await mongoDBServer.stop(); mongoDBServer = undefined; }
	apiUrl = undefined;
	mongoSeeded = false;
}

async function ensureMongoDBServer(options?: { port?: number; dbName?: string }): Promise<MongoDBTestServer> {
	if (mongoDBServer) return mongoDBServer;

	const connectionString = options?.port ? apiSettings.cosmosDbConnectionString : '';

	if (connectionString && await MongoDBTestServer.isReachable(connectionString)) {
		if (!mongoSeeded) {
			await MongoDBTestServer.seedData(connectionString, options?.dbName ?? apiSettings.cosmosDbName);
			mongoSeeded = true;
		}
		mongoDBServer = new MongoDBTestServer();
		await mongoDBServer.start(options);
		return mongoDBServer;
	}

	mongoDBServer = new MongoDBTestServer();
	await mongoDBServer.start(options);
	mongoSeeded = true;
	return mongoDBServer;
}

export async function ensureApiServers(): Promise<void> {
	if (graphQLServer) return;

	const mongo = await ensureMongoDBServer();
	const realFactory = createRealApplicationServicesFactory(mongo.getServiceMongoose());
	graphQLServer = new GraphQLTestServer(realFactory);
	await graphQLServer.start();
	apiUrl = graphQLServer.getUrl();
}
