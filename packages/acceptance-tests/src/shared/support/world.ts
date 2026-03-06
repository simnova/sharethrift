import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { configure, type Cast, type Actor, TakeNotes, Notepad } from '@serenity-js/core';
import { RenderComponents } from '../abilities/render-components.js';
import { listingAbilities } from '../../contexts/listing/abilities/index.js';
import { DomainListingSession } from '../../contexts/listing/abilities/domain-listing-session.js';
import { GraphQLListingSession } from '../../contexts/listing/abilities/graphql-listing-session.js';
import type { ItemListing } from '../../contexts/listing/abilities/listing-session.js';
import { reservationRequestAbilities } from '../../contexts/reservation-request/abilities/index.js';
import { DomainReservationRequestSession } from '../../contexts/reservation-request/abilities/domain-reservation-request-session.js';
import { GraphQLReservationRequestSession } from '../../contexts/reservation-request/abilities/graphql-reservation-request-session.js';
import type { ReservationRequest } from '../../contexts/reservation-request/abilities/reservation-request-session.js';
import { MultiContextSession } from '../abilities/multi-context-session.js';
import { TestServer } from './test-server.js';
import { createTestApplicationServicesFactory } from './test-application-services.js';
import { cleanup } from '@testing-library/react';

// Shared stores cleared per scenario
const sharedReservationRequestStore = new Map<string, ReservationRequest>();
const sharedListingStore = new Map<string, ItemListing>();

type TaskLevel = 'domain' | 'session' | 'dom';
type SessionType = 'domain' | 'graphql';

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
		private readonly sharedReservationRequestStore: Map<string, ReservationRequest>,
		private readonly sharedListingStore: Map<string, ItemListing>,
	) {}

	prepare(actor: Actor): Actor {
		switch (this.tasksLevel) {
			case 'domain':
				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					...listingAbilities,
					...reservationRequestAbilities,
					new DomainListingSession(this.sharedListingStore),
					new DomainReservationRequestSession(this.sharedReservationRequestStore),
				);

			case 'session': {
				const listingSession =
					this.sessionType === 'graphql'
						? new GraphQLListingSession(this.apiUrl)
						: new DomainListingSession(this.sharedListingStore);

				const reservationRequestSession =
					this.sessionType === 'graphql'
						? new GraphQLReservationRequestSession(this.apiUrl)
						: new DomainReservationRequestSession(this.sharedReservationRequestStore);

					const multiSession = new MultiContextSession();
				multiSession.registerSession('listing', listingSession);
				multiSession.registerSession('reservation', reservationRequestSession);

				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					multiSession,
				);
			}

			case 'dom': {
				const listingSession =
					this.sessionType === 'graphql'
						? new GraphQLListingSession(this.apiUrl)
						: new DomainListingSession(this.sharedListingStore);

				const reservationRequestSession =
					this.sessionType === 'graphql'
						? new GraphQLReservationRequestSession(this.apiUrl)
						: new DomainReservationRequestSession(this.sharedReservationRequestStore);

					const multiSession = new MultiContextSession();
				multiSession.registerSession('listing', listingSession);
				multiSession.registerSession('reservation', reservationRequestSession);

				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					RenderComponents.using(),
					multiSession,
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
	private readonly apiUrl: string;
	private testServer: TestServer | undefined;

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
			const url = await this.testServer.start(4000);
			console.log(`[WORLD] GraphQL test server started at ${url}`);
		}

		sharedReservationRequestStore.clear();
		sharedListingStore.clear();

		const cast = new ShareThriftCast(
			this.tasksLevel,
			this.sessionType,
			this.apiUrl,
			sharedReservationRequestStore,
			sharedListingStore,
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
			console.log('[WORLD] GraphQL test server stopped');
		}
	}

	get level(): TaskLevel {
		return this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
