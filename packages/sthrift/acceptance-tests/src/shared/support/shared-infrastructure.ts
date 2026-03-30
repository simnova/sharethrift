import { chromium, type Browser } from '@playwright/test';
import { BrowseTheWeb } from '../abilities/browse-the-web.ts';
import { GraphQLTestServer, MongoDBTestServer, TestOAuth2Server, TestViteServer, TestApiServer, initTestEnvironment, cleanupTestEnvironment, setMongoConnectionString } from './servers/index.ts';
import { createTestApplicationServicesFactory, createRealApplicationServicesFactory } from './application-services/index.ts';
import { defaultActor } from './test-data/test-actors.ts';
import { performOAuth2Login } from './oauth2-login.ts';
import { apiSettings } from './local-settings.ts';
import type { SessionType } from '../../world.ts';

const isDeployedE2E = process.env['E2E_DEPLOYED'] === 'true';
const deployedApiUrl = process.env['E2E_API_URL'];
const deployedUiUrl = process.env['E2E_UI_URL'];

// Shared infrastructure — persists across scenarios within a single test run
let mongoDBServer: MongoDBTestServer | undefined;
let mongoSeeded = false;
let graphQLServer: GraphQLTestServer | undefined;
let oauth2Server: TestOAuth2Server | undefined;
let apiServer: TestApiServer | undefined;
let viteServer: TestViteServer | undefined;
let apiUrl: string | undefined;
let accessToken: string | undefined;
let browser: Browser | undefined;
let browserBaseUrl: string | undefined;
let browseTheWeb: BrowseTheWeb | undefined;

export interface InfrastructureState {
	apiUrl: string | undefined;
	accessToken: string | undefined;
	browseTheWeb: BrowseTheWeb | undefined;
}

export function getState(): InfrastructureState {
	return { apiUrl, accessToken, browseTheWeb };
}

export async function stopAll(): Promise<void> {
	if (browseTheWeb) { await browseTheWeb.close(); browseTheWeb = undefined; }
	if (browser) { await browser.close(); browser = undefined; }
	if (viteServer) { await viteServer.stop(); viteServer = undefined; }
	if (apiServer) { await apiServer.stop(); apiServer = undefined; }
	if (oauth2Server) { await oauth2Server.stop(); oauth2Server = undefined; }
	if (graphQLServer) { await graphQLServer.stop(); graphQLServer = undefined; }
	if (mongoDBServer) { await mongoDBServer.stop(); mongoDBServer = undefined; }
	apiUrl = undefined;
	browserBaseUrl = undefined;
	accessToken = undefined;
	mongoSeeded = false;
	cleanupTestEnvironment();
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

export async function ensureSessionServers(sessionType: SessionType): Promise<void> {
	if (graphQLServer) return;

	if (sessionType === 'graphql') {
		const testFactory = createTestApplicationServicesFactory();
		graphQLServer = new GraphQLTestServer(testFactory);
		await graphQLServer.start();
		apiUrl = graphQLServer.getUrl();
	}

	if (sessionType === 'mongodb') {
		const mongo = await ensureMongoDBServer();
		const realFactory = createRealApplicationServicesFactory(mongo.getServiceMongoose());
		graphQLServer = new GraphQLTestServer(realFactory);
		await graphQLServer.start();
		apiUrl = graphQLServer.getUrl();
	}
}

export async function ensureE2EServers(): Promise<void> {
	if (isDeployedE2E) {
		await initDeployedE2E();
	} else {
		await initLocalE2E();
	}
}

async function initLocalE2E(): Promise<void> {

	await initTestEnvironment();

	if (!mongoDBServer) {
		mongoDBServer = new MongoDBTestServer();
		await mongoDBServer.start();
		setMongoConnectionString(mongoDBServer.getConnectionString());
		mongoSeeded = true;
	}

	if (!oauth2Server) {
		oauth2Server = new TestOAuth2Server({
			testUser: {
				email: defaultActor.email,
				given_name: defaultActor.givenName,
				family_name: defaultActor.familyName,
			},
		});
		await oauth2Server.start();
	}

	if (!apiServer) {
		apiServer = new TestApiServer();
		await apiServer.start();
		apiUrl = apiServer.getUrl();
	}

	if (!accessToken) {
		accessToken = await oauth2Server.generateAccessToken(apiSettings.userPortalOidcAudience);
	}

	if (!viteServer) {
		viteServer = new TestViteServer();
		await viteServer.start();
	}
	browserBaseUrl = viteServer.getUrl();

	if (!apiUrl) {
		apiUrl = apiServer?.getUrl();
	}

	if (!browser) {
		browser = await chromium.launch({ headless: false });
	}

	if (!browseTheWeb && browser && browserBaseUrl) {
		const context = await browser.newContext({
			baseURL: browserBaseUrl,
			ignoreHTTPSErrors: true,
		});
		const page = await context.newPage();
		await performOAuth2Login(page);
		browseTheWeb = BrowseTheWeb.using(page, context);
	}
}

async function initDeployedE2E(): Promise<void> {
	if (!deployedApiUrl) throw new Error('E2E_API_URL is required when E2E_DEPLOYED=true');
	if (!deployedUiUrl) throw new Error('E2E_UI_URL is required when E2E_DEPLOYED=true');

	apiUrl = deployedApiUrl;
	browserBaseUrl = deployedUiUrl;
	accessToken = process.env['E2E_ACCESS_TOKEN'] ?? undefined;

	if (!browser) {
		browser = await chromium.launch({ headless: true, args: ['--headless=new'] });
	}
}
