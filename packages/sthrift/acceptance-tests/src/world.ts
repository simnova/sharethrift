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
import { localSettings } from './shared/support/local-settings.ts';
import { chromium, type Browser } from '@playwright/test';

type TaskLevel = 'domain' | 'session' | 'e2e';
type SessionType = 'graphql' | 'mongodb';

export interface WorldParameters {
	tasks: TaskLevel;
	session?: SessionType;
	apiUrl?: string;
}

// Environment detection — E2E_DEPLOYED or use local.settings.json
const isDeployedE2E = process.env['E2E_DEPLOYED'] === 'true';
const deployedApiUrl = process.env['E2E_API_URL'];
const deployedUiUrl = process.env['E2E_UI_URL'];

// Shared servers persist across scenarios to avoid port conflicts
let sharedGraphQLServer: TestServer | undefined;
let sharedMongoDBServer: MongoDBTestServer | undefined;
let sharedMongoDBGraphQLServer: TestServer | undefined;
let sharedApiUrl: string | undefined;

// E2E infrastructure
let sharedOAuth2Server: TestOAuth2Server | undefined;
let sharedApiServer: TestApiServer | undefined;
let sharedViteServer: TestViteServer | undefined;
let sharedBrowser: Browser | undefined;
let sharedBrowserBaseUrl: string | undefined;
let sharedAccessToken: string | undefined;

// E2E MongoDB
let sharedE2EMongoServer: MongoDBTestServer | undefined;
let sharedE2EMongoSeeded = false;

export async function stopSharedServers(): Promise<void> {
	if (sharedBrowser) {
		await sharedBrowser.close();
		sharedBrowser = undefined;
	}
	if (sharedViteServer) {
		await sharedViteServer.stop();
		sharedViteServer = undefined;
	}
	if (sharedApiServer) {
		await sharedApiServer.stop();
		sharedApiServer = undefined;
	}
	if (sharedOAuth2Server) {
		await sharedOAuth2Server.stop();
		sharedOAuth2Server = undefined;
	}
	if (sharedMongoDBGraphQLServer) {
		await sharedMongoDBGraphQLServer.stop();
		sharedMongoDBGraphQLServer = undefined;
	}
	if (sharedGraphQLServer) {
		await sharedGraphQLServer.stop();
		sharedGraphQLServer = undefined;
	}
	if (sharedMongoDBServer) {
		await sharedMongoDBServer.stop();
		sharedMongoDBServer = undefined;
	}
	if (sharedE2EMongoServer) {
		await sharedE2EMongoServer.stop();
		sharedE2EMongoServer = undefined;
	}
	sharedApiUrl = undefined;
	sharedBrowserBaseUrl = undefined;
	sharedAccessToken = undefined;
	sharedE2EMongoSeeded = false;
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
		let listingSession: GraphQLListingSession | MongoListingSession;
		let reservationRequestSession: GraphQLReservationRequestSession | MongoReservationRequestSession;

		switch (this.sessionType) {
			case 'mongodb':
				listingSession = new MongoListingSession(this.apiUrl, this.authToken);
				reservationRequestSession = new MongoReservationRequestSession(this.apiUrl, this.authToken);
				break;
			default:
				listingSession = new GraphQLListingSession(this.apiUrl, this.authToken);
				reservationRequestSession = new GraphQLReservationRequestSession(this.apiUrl, this.authToken);
				break;
		}

		const multiSession = new MultiContextSession();
		multiSession.registerSession('listing', listingSession);
		multiSession.registerSession('reservation', reservationRequestSession);

		return multiSession;
	}

	prepare(actor: Actor): Actor {
		switch (this.tasksLevel) {
			case 'domain':
				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					...listingAbilities,
					...reservationRequestAbilities,
				);

			case 'session':
				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					this.createMultiContextSession(),
				);

			case 'e2e': {
				if (!this.browseTheWeb) {
					throw new Error('E2E tests require a browser — ensure the BrowseTheWeb ability was created');
				}
				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					this.browseTheWeb,
					this.createMultiContextSession(),
				);
			}

			default:
				throw new Error(`Unknown testing level: ${this.tasksLevel}`);
		}
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

		if (this.sessionType === 'mongodb' && !sharedMongoDBServer) {
			sharedMongoDBServer = new MongoDBTestServer();
			await sharedMongoDBServer.start();

			const serviceMongoose = sharedMongoDBServer.getServiceMongoose();
			const realFactory = createRealApplicationServicesFactory(serviceMongoose);
			sharedMongoDBGraphQLServer = new TestServer(realFactory);
			await sharedMongoDBGraphQLServer.start();
			sharedApiUrl = sharedMongoDBGraphQLServer.getUrl();
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

		// Fresh browser context per scenario for E2E
		if (this.tasksLevel === 'e2e' && sharedBrowser && sharedBrowserBaseUrl && sharedOAuth2Server) {
			const context = await sharedBrowser.newContext({
				baseURL: sharedBrowserBaseUrl,
				ignoreHTTPSErrors: true,
			});
			const page = await context.newPage();

			const { storageKey, storageValue } = await sharedOAuth2Server.generateOidcUserSession();
			await context.addInitScript(({ key, value }: { key: string; value: string }) => {
				sessionStorage.setItem(key, value);
			}, { key: storageKey, value: storageValue });

			this.browseTheWeb = BrowseTheWeb.using(page, context);
		}

		// E2E without OAuth2 server (deployed)
		if (this.tasksLevel === 'e2e' && sharedBrowser && sharedBrowserBaseUrl && !sharedOAuth2Server) {
			const context = await sharedBrowser.newContext({
				baseURL: sharedBrowserBaseUrl,
				ignoreHTTPSErrors: true,
			});
			const page = await context.newPage();
			this.browseTheWeb = BrowseTheWeb.using(page, context);
		}

		const cast = new ShareThriftCast(
			this.tasksLevel,
			this.sessionType,
			this.apiUrl,
			this.browseTheWeb,
			sharedAccessToken,
		);

		engage(cast);
	}

	// Local E2E infrastructure from local.settings.json (probes before starting)
	private async initLocalE2E(): Promise<void> {
		// Accept portless self-signed certs
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

		const {
			cosmosDbConnectionString,
			cosmosDbName,
			cosmosDbPort,
			apiGraphqlUrl,
			uiUrl,
		} = localSettings;

		// Ensure MongoDB is seeded
		if (!sharedE2EMongoSeeded) {
			const mongoUp = await MongoDBTestServer.isReachable(cosmosDbConnectionString);
			if (!mongoUp) {
				sharedE2EMongoServer = new MongoDBTestServer();
				await sharedE2EMongoServer.start({ port: cosmosDbPort, dbName: cosmosDbName });
			} else {
				await MongoDBTestServer.seedData(cosmosDbConnectionString, cosmosDbName);
			}
			sharedE2EMongoSeeded = true;
		}

		// Ensure OAuth2 mock is reachable
		if (!sharedOAuth2Server) {
			sharedOAuth2Server = new TestOAuth2Server({
				testUser: {
					email: 'alice@example.com',
					given_name: 'Alice',
					family_name: 'Smith',
				},
			});
			await sharedOAuth2Server.start();
		}

		// Ensure API is reachable
		if (!sharedApiServer) {
			sharedApiServer = new TestApiServer();
			await sharedApiServer.start();
			sharedApiUrl = sharedApiServer.getUrl();
		}

		// Generate access token
		if (!sharedAccessToken) {
			sharedAccessToken =
				await sharedOAuth2Server.generateAccessToken(localSettings.oauthAudience);
		}

		// Ensure UI dev server is reachable
		if (!sharedViteServer) {
			sharedViteServer = new TestViteServer();
			await sharedViteServer.start();
			sharedBrowserBaseUrl = uiUrl;
		}

		// Use API URL from settings
		if (!sharedApiUrl) {
			sharedApiUrl = apiGraphqlUrl;
		}

		// Launch browser
		if (!sharedBrowser) {
			sharedBrowser = await chromium.launch({
				headless: true,
				args: ['--headless=new'],
			});
		}
	}

	// Deployed E2E — requires E2E_DEPLOYED, E2E_API_URL, E2E_UI_URL env vars
	private async initDeployedE2E(): Promise<void> {
		if (!deployedApiUrl) {
			throw new Error('E2E_API_URL is required when E2E_DEPLOYED=true');
		}
		if (!deployedUiUrl) {
			throw new Error('E2E_UI_URL is required when E2E_DEPLOYED=true');
		}

		sharedApiUrl = deployedApiUrl;
		sharedBrowserBaseUrl = deployedUiUrl;

		sharedAccessToken = process.env['E2E_ACCESS_TOKEN'] ?? undefined;

		if (!sharedBrowser) {
			sharedBrowser = await chromium.launch({
				headless: true,
				args: ['--headless=new'],
			});
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

	// Setup level (Given steps) — E2E uses session layer for speed
	get setupLevel(): TaskLevel {
		return this.tasksLevel === 'e2e' ? 'session' : this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
