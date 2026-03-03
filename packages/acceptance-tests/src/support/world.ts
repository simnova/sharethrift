import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { actorCalled, configure, type Cast, type Actor, TakeNotes, Notepad } from '@serenity-js/core';
import { RenderComponents } from '../abilities/RenderComponents.js';
import { CreateListingAbility } from '../abilities/CreateListingAbility.js';
import { DomainSession } from '../abilities/DomainSession.js';
import { GraphQLSession } from '../abilities/GraphQLSession.js';
import { TestServer } from './test-server.js';
import { createTestApplicationServicesFactory } from './test-application-services.js';

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
 * 3. session + GraphQLSession = Full integration tests (HTTP + domain, 100ms)
 * 4. dom + DomainSession = Real UI tests with happy-dom (component tests, ~100-500ms per test)
 * 5. dom + GraphQLSession = Real UI + Real API tests with happy-dom (~500ms-1s per test)
 *
 * DOM tests render the actual CreateListing component in happy-dom (headless DOM)
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export interface WorldParameters {
	tasks: 'domain' | 'session' | 'dom';
	session?: 'domain' | 'graphql';
	apiUrl?: string;
}

/**
 * Custom Cast that prepares actors with abilities based on testing level.
 */
class ShareThriftCast implements Cast {
	constructor(
		private readonly tasksLevel: 'domain' | 'session' | 'dom',
		private readonly sessionType: 'domain' | 'graphql',
		private readonly apiUrl: string,
	) {}

	prepare(actor: Actor): Actor {
		switch (this.tasksLevel) {
			case 'domain':
				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					CreateListingAbility.using({} as any, {} as any, {} as any),
				);

			case 'session': {
				const session =
					this.sessionType === 'graphql'
						? GraphQLSession.at(this.apiUrl)
						: DomainSession.withDirectDomainAccess();

				return actor.whoCan(TakeNotes.using(Notepad.empty()), session);
			}

			case 'dom': {
				const session =
					this.sessionType === 'graphql'
						? GraphQLSession.at(this.apiUrl)
						: DomainSession.withDirectDomainAccess();

				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					RenderComponents.using(),
					session,
				);
			}

			default:
				throw new Error(`Unknown testing level: ${this.tasksLevel}`);
		}
	}
}

export class ShareThriftWorld extends World<WorldParameters> {
	private readonly tasksLevel: 'domain' | 'session' | 'dom';
	private readonly sessionType: 'domain' | 'graphql';
	private readonly apiUrl: string;
	private testServer?: TestServer;

	constructor(options: IWorldOptions<WorldParameters>) {
		super(options);
		this.tasksLevel = (options.parameters?.tasks || 'domain') as any;
		this.sessionType = options.parameters?.session || 'domain';
		this.apiUrl = options.parameters?.apiUrl || 'http://localhost:4000/graphql';
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

		const cast = new ShareThriftCast(
			this.tasksLevel,
			this.sessionType,
			this.apiUrl,
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
				const { cleanup } = await import('@testing-library/react');
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

	get level(): 'domain' | 'session' | 'dom' {
		return this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
