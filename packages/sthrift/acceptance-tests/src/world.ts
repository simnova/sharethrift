import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { engage, type Cast, type Actor, TakeNotes, Notepad } from '@serenity-js/core';
import './shared/support/hooks.ts';
import { BrowseTheWeb } from './shared/abilities/browse-the-web.ts';
import { listingAbilities } from './contexts/listing/abilities/index.ts';
import { GraphQLListingSession } from './contexts/listing/abilities/graphql-listing-session.ts';
import { MongoListingSession } from './contexts/listing/abilities/mongo-listing-session.ts';
import { reservationRequestAbilities } from './contexts/reservation-request/abilities/index.ts';
import { GraphQLReservationRequestSession } from './contexts/reservation-request/abilities/graphql-reservation-request-session.ts';
import { MongoReservationRequestSession } from './contexts/reservation-request/abilities/mongo-reservation-request-session.ts';
import { MultiContextSession } from './shared/abilities/multi-context-session.ts';
import { TestServer, MongoDBTestServer, TestOAuth2Server, TestViteServer, TestApiServer } from './shared/support/servers/index.ts';
import { createTestApplicationServicesFactory, createRealApplicationServicesFactory } from './shared/support/application-services/index.ts';
import { clearMockListings } from './shared/support/test-data/listing.test-data.ts';
import { clearMockReservationRequests } from './shared/support/test-data/reservation-request.test-data.ts';
import { defaultActor } from './shared/support/test-data/test-actors.ts';
import { performOAuth2Login } from './shared/support/oauth2-login.ts';
import { apiSettings, uiSettings } from './shared/support/local-settings.ts';
import { chromium, type Browser } from '@playwright/test';

type TaskLevel = 'domain' | 'session' | 'e2e';
type SessionType = 'graphql' | 'mongodb';

export interface WorldParameters {
	tasks: TaskLevel;
	session?: SessionType;
	apiUrl?: string;
}

const isDeployedE2E = process.env['E2E_DEPLOYED'] === 'true';
const deployedApiUrl = process.env['E2E_API_URL'];
const deployedUiUrl = process.env['E2E_UI_URL'];

// Shared infrastructure — persists across scenarios within a single test run
let sharedMongoDBServer: MongoDBTestServer | undefined;
let sharedMongoSeeded = false;
let sharedGraphQLServer: TestServer | undefined;
let sharedOAuth2Server: TestOAuth2Server | undefined;
let sharedApiServer: TestApiServer | undefined;
let sharedViteServer: TestViteServer | undefined;
let sharedApiUrl: string | undefined;
let sharedAccessToken: string | undefined;
let sharedBrowser: Browser | undefined;
let sharedBrowserBaseUrl: string | undefined;

export async function stopSharedServers(): Promise<void> {
	if (sharedBrowser) { await sharedBrowser.close(); sharedBrowser = undefined; }
	if (sharedViteServer) { await sharedViteServer.stop(); sharedViteServer = undefined; }
	if (sharedApiServer) { await sharedApiServer.stop(); sharedApiServer = undefined; }
	if (sharedOAuth2Server) { await sharedOAuth2Server.stop(); sharedOAuth2Server = undefined; }
	if (sharedGraphQLServer) { await sharedGraphQLServer.stop(); sharedGraphQLServer = undefined; }
	if (sharedMongoDBServer) { await sharedMongoDBServer.stop(); sharedMongoDBServer = undefined; }
	sharedApiUrl = undefined;
	sharedBrowserBaseUrl = undefined;
	sharedAccessToken = undefined;
	sharedMongoSeeded = false;
}

async function ensureMongoDBServer(options?: { port?: number; dbName?: string }): Promise<MongoDBTestServer> {
	if (sharedMongoDBServer) return sharedMongoDBServer;

	const connectionString = options?.port ? apiSettings.cosmosDbConnectionString : '';

	if (connectionString && await MongoDBTestServer.isReachable(connectionString)) {
		if (!sharedMongoSeeded) {
			await MongoDBTestServer.seedData(connectionString, options?.dbName ?? apiSettings.cosmosDbName);
			sharedMongoSeeded = true;
		}
		sharedMongoDBServer = new MongoDBTestServer();
		await sharedMongoDBServer.start(options);
		return sharedMongoDBServer;
	}

	sharedMongoDBServer = new MongoDBTestServer();
	await sharedMongoDBServer.start(options);
	sharedMongoSeeded = true;
	return sharedMongoDBServer;
}

class ShareThriftCast implements Cast {
	constructor(
		private readonly tasksLevel: TaskLevel,
		private readonly sessionType: SessionType,
		private readonly apiUrl: string,
		private readonly browseTheWeb?: BrowseTheWeb,
		private readonly authToken?: string,
	) {}

	private createMultiContextSession(): MultiContextSession {
		const multiSession = new MultiContextSession();

		if (this.sessionType === 'mongodb') {
			multiSession.registerSession('listing', new MongoListingSession(this.apiUrl, this.authToken));
			multiSession.registerSession('reservation', new MongoReservationRequestSession(this.apiUrl, this.authToken));
		} else {
			multiSession.registerSession('listing', new GraphQLListingSession(this.apiUrl, this.authToken));
			multiSession.registerSession('reservation', new GraphQLReservationRequestSession(this.apiUrl, this.authToken));
		}

		return multiSession;
	}

	prepare(actor: Actor): Actor {
		if (this.tasksLevel === 'domain') {
			return actor.whoCan(
				TakeNotes.using(Notepad.empty()),
				...listingAbilities,
				...reservationRequestAbilities,
			);
		}

		if (this.tasksLevel === 'e2e') {
			if (!this.browseTheWeb) {
				throw new Error('E2E tests require a browser');
			}
			return actor.whoCan(
				TakeNotes.using(Notepad.empty()),
				this.browseTheWeb,
				this.createMultiContextSession(),
			);
		}

		return actor.whoCan(
			TakeNotes.using(Notepad.empty()),
			this.createMultiContextSession(),
		);
	}
}

export class ShareThriftWorld extends World<WorldParameters> {
	private readonly tasksLevel: TaskLevel;
	private readonly sessionType: SessionType;
	private apiUrl: string;
	private browseTheWeb: BrowseTheWeb | undefined;

	constructor(options: IWorldOptions<WorldParameters>) {
		super(options);
		this.tasksLevel = options.parameters?.tasks || 'domain';
		this.sessionType = options.parameters?.session || 'graphql';
		this.apiUrl = options.parameters?.apiUrl || 'http://localhost:4000/graphql';
	}

	async init(): Promise<void> {
		if (this.sessionType === 'graphql' && !sharedGraphQLServer) {
			const testFactory = createTestApplicationServicesFactory();
			sharedGraphQLServer = new TestServer(testFactory);
			await sharedGraphQLServer.start();
			sharedApiUrl = sharedGraphQLServer.getUrl();
		}

		if (this.sessionType === 'mongodb' && !sharedGraphQLServer) {
			const mongo = await ensureMongoDBServer();
			const realFactory = createRealApplicationServicesFactory(mongo.getServiceMongoose());
			sharedGraphQLServer = new TestServer(realFactory);
			await sharedGraphQLServer.start();
			sharedApiUrl = sharedGraphQLServer.getUrl();
		}

		if (this.tasksLevel === 'e2e') {
			if (isDeployedE2E) {
				await this.initDeployedE2E();
			} else {
				await this.initLocalE2E();
			}
		}

		if (sharedApiUrl) {
			this.apiUrl = sharedApiUrl;
		}

		clearMockReservationRequests();
		clearMockListings();

		if (this.tasksLevel === 'e2e' && sharedBrowser && sharedBrowserBaseUrl) {
			const context = await sharedBrowser.newContext({
				baseURL: sharedBrowserBaseUrl,
				ignoreHTTPSErrors: true,
			});
			const page = await context.newPage();
			await performOAuth2Login(page);
			this.browseTheWeb = BrowseTheWeb.using(page, context);
		}

		engage(new ShareThriftCast(
			this.tasksLevel,
			this.sessionType,
			this.apiUrl,
			this.browseTheWeb,
			sharedAccessToken,
		));
	}

	private async initLocalE2E(): Promise<void> {
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
		const { cosmosDbConnectionString, cosmosDbName, cosmosDbPort } = apiSettings;

		if (!sharedMongoSeeded) {
			const mongoUp = await MongoDBTestServer.isReachable(cosmosDbConnectionString);
			if (!mongoUp) {
				await ensureMongoDBServer({ port: cosmosDbPort, dbName: cosmosDbName });
			} else {
				await MongoDBTestServer.seedData(cosmosDbConnectionString, cosmosDbName);
				sharedMongoSeeded = true;
			}
		}

		if (!sharedOAuth2Server) {
			sharedOAuth2Server = new TestOAuth2Server({
				testUser: {
					email: defaultActor.email,
					given_name: defaultActor.givenName,
					family_name: defaultActor.familyName,
				},
			});
			await sharedOAuth2Server.start();
		}

		if (!sharedApiServer) {
			sharedApiServer = new TestApiServer();
			await sharedApiServer.start();
			sharedApiUrl = sharedApiServer.getUrl();
		}

		if (!sharedAccessToken) {
			sharedAccessToken =
				await sharedOAuth2Server.generateAccessToken(apiSettings.userPortalOidcAudience);
		}

		if (!sharedViteServer) {
			sharedViteServer = new TestViteServer();
			await sharedViteServer.start();
		}
		sharedBrowserBaseUrl = uiSettings.baseUrl;

		if (!sharedApiUrl) {
			sharedApiUrl = apiSettings.apiGraphqlUrl;
		}

		if (!sharedBrowser) {
			sharedBrowser = await chromium.launch({ headless: false });
		}
	}

	private async initDeployedE2E(): Promise<void> {
		if (!deployedApiUrl) throw new Error('E2E_API_URL is required when E2E_DEPLOYED=true');
		if (!deployedUiUrl) throw new Error('E2E_UI_URL is required when E2E_DEPLOYED=true');

		sharedApiUrl = deployedApiUrl;
		sharedBrowserBaseUrl = deployedUiUrl;
		sharedAccessToken = process.env['E2E_ACCESS_TOKEN'] ?? undefined;

		if (!sharedBrowser) {
			sharedBrowser = await chromium.launch({ headless: true, args: ['--headless=new'] });
		}
	}

	async cleanup(): Promise<void> {
		if (this.browseTheWeb) {
			await this.browseTheWeb.close();
			this.browseTheWeb = undefined;
		}
	}

	get level(): TaskLevel {
		return this.tasksLevel;
	}

	get setupLevel(): TaskLevel {
		return this.tasksLevel === 'e2e' ? 'session' : this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
