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
import { TestServer, MongoDBTestServer, TestOAuth2Server, TestViteServer } from './shared/support/servers/index.ts';
import { createTestApplicationServicesFactory, createRealApplicationServicesFactory } from './shared/support/application-services/index.ts';
import { clearMockListings } from './shared/support/test-data/listing.test-data.ts';
import { clearMockReservationRequests } from './shared/support/test-data/reservation-request.test-data.ts';
import { chromium, type Browser } from '@playwright/test';

type TaskLevel = 'domain' | 'session' | 'e2e';
type SessionType = 'graphql' | 'mongodb';

export interface WorldParameters {
	tasks: TaskLevel;
	session?: SessionType;
	apiUrl?: string;
}

// Shared servers persist across scenarios within a test run to avoid
// port conflicts and stale-URL issues caused by Serenity.js actor caching.
let sharedGraphQLServer: TestServer | undefined;
let sharedMongoDBServer: MongoDBTestServer | undefined;
let sharedMongoDBGraphQLServer: TestServer | undefined;
let sharedApiUrl: string | undefined;

// E2E infrastructure — shared across scenarios
let sharedOAuth2Server: TestOAuth2Server | undefined;
let sharedViteServer: TestViteServer | undefined;
let sharedBrowser: Browser | undefined;
let sharedBrowserBaseUrl: string | undefined;

export async function stopSharedServers(): Promise<void> {
	if (sharedBrowser) {
		await sharedBrowser.close();
		sharedBrowser = undefined;
	}
	if (sharedViteServer) {
		await sharedViteServer.stop();
		sharedViteServer = undefined;
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
	sharedApiUrl = undefined;
	sharedBrowserBaseUrl = undefined;
}

class ShareThriftCast implements Cast {
	constructor(
		private readonly tasksLevel: TaskLevel,
		private readonly sessionType: SessionType,
		private readonly apiUrl: string,
		private readonly browseTheWeb?: BrowseTheWeb,
	) {}

	private createMultiContextSession(): MultiContextSession {
		let listingSession: GraphQLListingSession | MongoListingSession;
		let reservationRequestSession: GraphQLReservationRequestSession | MongoReservationRequestSession;

		switch (this.sessionType) {
			case 'mongodb':
				listingSession = new MongoListingSession(this.apiUrl);
				reservationRequestSession = new MongoReservationRequestSession(this.apiUrl);
				break;
			default:
				listingSession = new GraphQLListingSession(this.apiUrl);
				reservationRequestSession = new GraphQLReservationRequestSession(this.apiUrl);
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
				// E2E actors need both browser (for When steps) and session (for Given setup steps)
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

		// E2E infrastructure: OAuth2 mock → GraphQL backend → Vite UI → Browser
		if (this.tasksLevel === 'e2e') {
			// 1. Start MongoDB + GraphQL backend (with real persistence)
			if (!sharedMongoDBServer) {
				sharedMongoDBServer = new MongoDBTestServer();
				await sharedMongoDBServer.start();

				const serviceMongoose = sharedMongoDBServer.getServiceMongoose();
				const realFactory = createRealApplicationServicesFactory(serviceMongoose);
				sharedMongoDBGraphQLServer = new TestServer(realFactory);
				await sharedMongoDBGraphQLServer.start();
				sharedApiUrl = sharedMongoDBGraphQLServer.getUrl();
			}

			// 2. Start mock OAuth2 server
			if (!sharedOAuth2Server) {
				sharedOAuth2Server = new TestOAuth2Server();
				await sharedOAuth2Server.start();
			}

			// 3. Start Vite dev server pointing at test backends
			if (!sharedViteServer) {
				sharedViteServer = new TestViteServer({
					graphqlUrl: sharedApiUrl!,
					oauth2Url: sharedOAuth2Server.getUrl(),
				});
				await sharedViteServer.start();
				sharedBrowserBaseUrl = sharedViteServer.getUrl();
			}

			// 4. Launch browser (once per test run)
			if (!sharedBrowser) {
				sharedBrowser = await chromium.launch({
					headless: true,
					args: ['--headless=new'],
				});
			}
		}

		if (sharedApiUrl) {
			this.apiUrl = sharedApiUrl;
		}

		clearMockReservationRequests();
		clearMockListings();

		// For E2E, create fresh browser context + page per scenario
		if (this.tasksLevel === 'e2e' && sharedBrowser && sharedBrowserBaseUrl && sharedOAuth2Server) {
			const context = await sharedBrowser.newContext({
				baseURL: sharedBrowserBaseUrl,
				ignoreHTTPSErrors: true,
			});
			const page = await context.newPage();

			// Pre-seed OIDC user session so the app considers us authenticated
			// without going through the full OAuth2 redirect flow.
			const { storageKey, storageValue } = await sharedOAuth2Server.generateOidcUserSession('e2e-test-client');
			await context.addInitScript(({ key, value }: { key: string; value: string }) => {
				sessionStorage.setItem(key, value);
			}, { key: storageKey, value: storageValue });

			this.browseTheWeb = BrowseTheWeb.using(page, context);
		}

		const cast = new ShareThriftCast(
			this.tasksLevel,
			this.sessionType,
			this.apiUrl,
			this.browseTheWeb,
		);

		// Use engage() to replace the cast and force fresh actors each scenario.
		// Serenity.js caches actors globally; without this, actors from previous
		// scenarios retain stale abilities pointing to stopped servers.
		engage(cast);
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

	/**
	 * The task level to use for setup/precondition steps (Given).
	 * For E2E, setup uses the session layer (GraphQL) for speed and
	 * reliability — only the main action (When) goes through the browser.
	 */
	get setupLevel(): TaskLevel {
		return this.tasksLevel === 'e2e' ? 'session' : this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
