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

/**
 * Task level determines which implementation to use (domain/session/dom)
 */
type TaskLevel = 'domain' | 'session' | 'dom';

/**
 * Session type determines which backend to use (domain/graphql)
 */
type SessionType = 'domain' | 'graphql';

/**
 * World parameters passed via --world-parameters CLI flag
 *
 * Following Screenplay.js design recommendations:
 * - tasks: Which task implementation to use (domain/session/dom)
 * - session: Which Session implementation (domain/graphql)
 *
 * Assemblies (from Screenplay.js):
 * 1. domain + DomainSession = Fastest tests (pure domain layer, <1ms)
 * 2. session + DomainSession = Fast tests (domain + session abstraction, <1ms)
 * 3. session + GraphqlSession = Full integration tests (HTTP + domain, 100ms)
 * 4. dom + DomainSession = Real UI tests with happy-dom (component tests, ~100-500ms per test)
 * 5. dom + GraphqlSession = Real UI + Real API tests with happy-dom (~500ms-1s per test)
 *
 * DOM tests render the actual CreateListing component in happy-dom (headless DOM)
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export interface WorldParameters {
	tasks: TaskLevel;
	session?: SessionType;
	apiUrl?: string;
}

/**
 * Custom Cast that prepares actors with abilities based on testing level.
 */
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
					new DomainReservationRequestSession(this.sharedReservationRequestStore),
				);

			case 'session': {
				const listingSession =
					this.sessionType === 'graphql'
						? new GraphQLListingSession(this.apiUrl)
						: new DomainListingSession(this.sharedListingStore);

				const reservationRequestSession =
					this.sessionType === 'graphql'
						? new GraphQLReservationRequestSession(this.apiUrl, this.sharedReservationRequestStore)
						: new DomainReservationRequestSession(this.sharedReservationRequestStore);

				// Create a master session that routes to the right context-specific session
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
						? new GraphQLReservationRequestSession(this.apiUrl, this.sharedReservationRequestStore)
						: new DomainReservationRequestSession(this.sharedReservationRequestStore);

				// Create a master session that routes to the right context-specific session
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
		// Start test server for GraphQL session tests
		if (this.sessionType === 'graphql' && !this.testServer) {
			// Create test ApplicationServicesFactory with in-memory storage
			const testFactory = createTestApplicationServicesFactory();

			this.testServer = new TestServer(testFactory);
			const url = await this.testServer.start(4000);
			console.log(`[WORLD] GraphQL test server started at ${url}`);
		}

		// Create fresh shared stores for each scenario
		const sharedReservationRequestStore = new Map();
		const sharedListingStore = new Map();

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

		console.log(`[WORLD] Configured Cast for ${this.tasksLevel} testing with ${this.sessionType} session`);
	}

	async cleanup(): Promise<void> {
		// Clean up DOM rendering environment (unmount React trees, keep globals)
		if (this.tasksLevel === 'dom') {
			try {
				cleanup();
			} catch {
				// testing-library may not have been imported yet
			}
		}

		// Stop GraphQL test server
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
