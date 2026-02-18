import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { actorCalled, Actor, Cast } from '@serenity-js/core';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb.js';
import { CallAnApi } from '../abilities/CallAnApi.js';
import { CreateListingAbility } from '../abilities/CreateListingAbility.js';

/**
 * World parameters passed via --world-parameters CLI flag
 */
export interface WorldParameters {
	tasks: 'domain' | 'graphql' | 'dom';
	apiUrl?: string;
	baseUrl?: string;
}

/**
 * Custom Cast that prepares actors with abilities based on testing level
 */
class ShareThriftCast implements Cast {
	constructor(
		private readonly tasksLevel: 'domain' | 'graphql' | 'dom',
		private readonly apiUrl: string,
		private readonly baseUrl: string,
	) {}

	prepare(actor: Actor): Actor {
		switch (this.tasksLevel) {
			case 'domain':
				// Domain level: Direct domain access abilities
				return actor.whoCan(
					CreateListingAbility.using(
						{} as any, // Mock UOW - TODO: Replace with real MongoDB Memory Server
						{} as any, // Mock User
						{} as any, // Mock Passport
					),
				);

			case 'graphql':
				// GraphQL level: API client abilities
				return actor.whoCan(CallAnApi.at(this.apiUrl));

			case 'dom':
				// DOM level: Browser automation abilities
				return actor.whoCan(BrowseTheWeb.using('chromium'), CallAnApi.at(this.apiUrl));

			default:
				throw new Error(`Unknown tasks level: ${this.tasksLevel}`);
		}
	}
}

/**
 * Custom World implementation that sets up Serenity/JS actors with abilities
 * based on the testing level (domain/graphql/dom).
 */
export class ShareThriftWorld extends World<WorldParameters> {
	private readonly tasksLevel: 'domain' | 'graphql' | 'dom';
	private readonly apiUrl: string;
	private readonly baseUrl: string;
	private readonly cast: ShareThriftCast;

	constructor(options: IWorldOptions<WorldParameters>) {
		super(options);

		// Get testing level from world parameters (default: domain)
		this.tasksLevel = options.parameters?.tasks || 'domain';
		this.apiUrl = options.parameters?.apiUrl || 'http://localhost:7071/api/graphql';
		this.baseUrl = options.parameters?.baseUrl || 'http://localhost:5173';

		// Create cast for this testing level
		this.cast = new ShareThriftCast(this.tasksLevel, this.apiUrl, this.baseUrl);
	}

	/**
	 * Get an actor by name (used in step definitions via {actor} parameter)
	 */
	actor(name: string): Actor {
		return this.cast.prepare(actorCalled(name));
	}

	/**
	 * Get the current testing level
	 */
	get level(): 'domain' | 'graphql' | 'dom' {
		return this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
