import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { engage, type Cast, type Actor, TakeNotes, Notepad } from '@serenity-js/core';
import './shared/support/hooks.ts';
import './shared/support/register-css.mjs';
import { RenderComponents } from './shared/abilities/render-components.ts';
import { listingAbilities } from './contexts/listing/abilities/index.ts';
import { DomainListingSession } from './contexts/listing/abilities/domain-listing-session.ts';
import { GraphQLListingSession } from './contexts/listing/abilities/graphql-listing-session.ts';
import { MongoListingSession } from './contexts/listing/abilities/mongo-listing-session.ts';
import { reservationRequestAbilities } from './contexts/reservation-request/abilities/index.ts';
import { DomainReservationRequestSession } from './contexts/reservation-request/abilities/domain-reservation-request-session.ts';
import { GraphQLReservationRequestSession } from './contexts/reservation-request/abilities/graphql-reservation-request-session.ts';
import { MongoReservationRequestSession } from './contexts/reservation-request/abilities/mongo-reservation-request-session.ts';
import { MultiContextSession } from './shared/abilities/multi-context-session.ts';
import { TestServer, MongoDBTestServer } from './shared/support/servers/index.ts';
import { createTestApplicationServicesFactory, createRealApplicationServicesFactory } from './shared/support/application-services/index.ts';
import { cleanup } from '@testing-library/react';
import { listings, clearMockListings } from './shared/support/test-data/listing.test-data.ts';
import { reservationRequests, clearMockReservationRequests } from './shared/support/test-data/reservation-request.test-data.ts';
type TaskLevel = 'domain' | 'session' | 'dom';
type SessionType = 'domain' | 'graphql' | 'mongodb';

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

export async function stopSharedServers(): Promise<void> {
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
}

class ShareThriftCast implements Cast {
	constructor(
		private readonly tasksLevel: TaskLevel,
		private readonly sessionType: SessionType,
		private readonly apiUrl: string,
	) {}

	private createMultiContextSession(): MultiContextSession {
		let listingSession: GraphQLListingSession | MongoListingSession | DomainListingSession;
		let reservationRequestSession: GraphQLReservationRequestSession | MongoReservationRequestSession | DomainReservationRequestSession;

		switch (this.sessionType) {
			case 'graphql':
				listingSession = new GraphQLListingSession(this.apiUrl);
				reservationRequestSession = new GraphQLReservationRequestSession(this.apiUrl);
				break;
			case 'mongodb':
				listingSession = new MongoListingSession(this.apiUrl);
				reservationRequestSession = new MongoReservationRequestSession(this.apiUrl);
				break;
			default:
				listingSession = new DomainListingSession(listings);
				reservationRequestSession = new DomainReservationRequestSession(reservationRequests);
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

			case 'dom':
				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					RenderComponents.using(),
					this.createMultiContextSession(),
				);

			default:
				throw new Error(`Unknown testing level: ${this.tasksLevel}`);
		}
	}
}

export class ShareThriftWorld extends World<WorldParameters> {
	private readonly tasksLevel: TaskLevel;
	private readonly sessionType: SessionType;
	private apiUrl: string;

	constructor(options: IWorldOptions<WorldParameters>) {
		super(options);
		this.tasksLevel = options.parameters?.tasks || 'domain';
		this.sessionType = options.parameters?.session || 'domain';
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

		if (sharedApiUrl) {
			this.apiUrl = sharedApiUrl;
		}

		clearMockReservationRequests();
		clearMockListings();

		const cast = new ShareThriftCast(
			this.tasksLevel,
			this.sessionType,
			this.apiUrl,
		);

		// Use engage() to replace the cast and force fresh actors each scenario.
		// Serenity.js caches actors globally; without this, actors from previous
		// scenarios retain stale abilities pointing to stopped servers.
		engage(cast);
	}

	async cleanup(): Promise<void> {
		if (this.tasksLevel === 'dom') {
			try {
				cleanup();
			} catch {
				// testing-library not imported
			}
		}
	}

	get level(): TaskLevel {
		return this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
