import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import {
	actorCalled,
	configure,
	Cast,
	type Actor,
	TakeNotes,
	Notepad,
} from '@serenity-js/core';
import { BrowseTheWebWithPlaywright, PlaywrightOptions } from '@serenity-js/playwright';
import { Browser, chromium } from '@playwright/test';
import { CallAnApi } from '../abilities/CallAnApi.js';
import { CreateListingAbility } from '../abilities/CreateListingAbility.js';

/**
 * World parameters passed via --world-parameters CLI flag
 *
 * Assembly configurations (cumulative):
 * - 'domain': Domain layer only (fastest)
 * - 'graphql': GraphQL + Domain layers (medium speed)
 * - 'dom': DOM + GraphQL + Domain layers (full stack)
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
				// Domain assembly: Domain layer only (fastest)
				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					CreateListingAbility.using(
						{} as any, // Mock UOW - TODO: Replace with real MongoDB Memory Server
						{} as any, // Mock User
						{} as any, // Mock Passport
					),
				);

			case 'graphql':
		case 'graphql':
			// GraphQL assembly: GraphQL + Domain layers (medium speed)
			// Uses real GraphQL API (Azure Functions) with MongoDB Memory Server
			return actor.whoCan(
				TakeNotes.using(Notepad.empty()),
				CallAnApi.at(this.apiUrl),
			);				// DOM assembly: DOM + GraphQL + Domain layers (full stack)
				// Tasks can use UI, or fall back to GraphQL/Domain for test setup
				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					BrowseTheWebWithPlaywright.using(async () => {
						const { chromium } = await import('playwright');
						return chromium.launch({ headless: true });
					}),
					CallAnApi.at(this.apiUrl),
				);

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

	constructor(options: IWorldOptions<WorldParameters>) {
		super(options);

		// Get testing level from world parameters (default: domain)
		this.tasksLevel = options.parameters?.tasks || 'domain';
		this.apiUrl = options.parameters?.apiUrl || 'http://localhost:7071/api/graphql';
		this.baseUrl = options.parameters?.baseUrl || 'http://localhost:5173';

		// Configure Serenity/JS with our custom cast
		configure({
			actors: new ShareThriftCast(this.tasksLevel, this.apiUrl, this.baseUrl),
			crew: [
				// Add reporters/crew members here if needed
			],
		});
	}

	/**
	 * Get the current assembly configuration
	 */
	get level(): 'domain' | 'graphql' | 'dom' {
		return this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
