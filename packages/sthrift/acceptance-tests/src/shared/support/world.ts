import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { configure, type Cast, type Actor, TakeNotes, Notepad } from '@serenity-js/core';
import { RenderComponents } from '../abilities/render-components.js';
import { listingAbilities } from '../../contexts/listing/abilities/index.js';
import { DomainListingSession } from '../../contexts/listing/abilities/domain-listing-session.js';
import { GraphQLListingSession } from '../../contexts/listing/abilities/graphql-listing-session.js';
import { MongoListingSession } from '../../contexts/listing/abilities/mongo-listing-session.js';
import { reservationRequestAbilities } from '../../contexts/reservation-request/abilities/index.js';
import { DomainReservationRequestSession } from '../../contexts/reservation-request/abilities/domain-reservation-request-session.js';
import { GraphQLReservationRequestSession } from '../../contexts/reservation-request/abilities/graphql-reservation-request-session.js';
import { MongoReservationRequestSession } from '../../contexts/reservation-request/abilities/mongo-reservation-request-session.js';
import { MultiContextSession } from '../abilities/multi-context-session.js';
import { TestServer } from './test-server.js';
import { MongoDBTestServer } from './test-mongodb-server.js';
import { createTestApplicationServicesFactory } from './test-application-services.js';
import { cleanup } from '@testing-library/react';
import { listings, clearMockListings } from './test-data/listing.test-data.js';
import { reservationRequests, clearMockReservationRequests } from './test-data/reservation-request.test-data.js';
type TaskLevel = 'domain' | 'session' | 'dom';
type SessionType = 'domain' | 'graphql' | 'mongodb';

export interface WorldParameters {
	tasks: TaskLevel;
	session?: SessionType;
	apiUrl?: string;
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
	private testServer: TestServer | undefined;
	private mongodbTestServer: MongoDBTestServer | undefined;

	constructor(options: IWorldOptions<WorldParameters>) {
		super(options);
		this.tasksLevel = options.parameters?.tasks || 'domain';
		this.sessionType = options.parameters?.session || 'domain';
		this.apiUrl = options.parameters?.apiUrl || 'http://localhost:4000/graphql';
		this.testServer = undefined;
	}

	async init(): Promise<void> {
		if (this.sessionType === 'graphql' && !this.testServer) {
			const testFactory = createTestApplicationServicesFactory();

			this.testServer = new TestServer(testFactory);
			await this.testServer.start(4000);
		}

		if (this.sessionType === 'mongodb') {
			// Always create a fresh MongoDBTestServer for each scenario to avoid Mongoose
			// discriminator re-registration issues. Stop the old one if it exists.
			if (this.mongodbTestServer) {
				await this.mongodbTestServer.stop();
			}

			this.mongodbTestServer = new MongoDBTestServer();
			const url = await this.mongodbTestServer.start(4001);
			this.apiUrl = url;
		}

		clearMockReservationRequests();
		clearMockListings();

		const cast = new ShareThriftCast(
			this.tasksLevel,
			this.sessionType,
			this.apiUrl,
		);

		configure({
			actors: cast,
			crew: [],
		});


	}

	async cleanup(): Promise<void> {
		if (this.tasksLevel === 'dom') {
			try {
				cleanup();
			} catch {
				// testing-library not imported
			}
		}

		if (this.testServer) {
			await this.testServer.stop();
			this.testServer = undefined;
		}

		if (this.mongodbTestServer) {
			await this.mongodbTestServer.stop();
			this.mongodbTestServer = undefined;
		}
	}

	get level(): TaskLevel {
		return this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
