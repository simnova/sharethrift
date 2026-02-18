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
import { CreateListingAbility } from '../abilities/CreateListingAbility.js';
import { MockGraphQL } from '../abilities/MockGraphQL.js';

/**
 * World parameters passed via --world-parameters CLI flag
 *
 * Following Aslak Hellesøy's Screenplay Pattern:
 * - tasks: Which task implementation to use (domain/graphql/dom)
 * - session: Which Session implementation (domain/http)
 *
 * Assemblies (Aslak's 4 configurations):
 * 1. session tasks + domain session = Fast API tests (MockGraphQL)
 * 2. session tasks + http session = API tests with real backend
 * 3. dom tasks + domain session = UI tests WITHOUT backend (mocked)
 * 4. dom tasks + http session = Full E2E (requires running UI + backend)
 *
 * We currently use #1 and #3 (no backend needed!)
 */
export interface WorldParameters {
	tasks: 'domain' | 'graphql' | 'dom';
	session?: 'domain' | 'http';  // Which Session implementation
	apiUrl?: string;   // For http session: real GraphQL endpoint
	baseUrl?: string;  // For dom tasks: URL where UI is served
}

/**
 * Custom Cast that prepares actors with abilities based on testing level.
 *
 * Implements Aslak Hellesøy's two-task recommendation:
 * - session tasks (domain/graphql): Use Session abstraction (MockGraphQL)
 * - dom tasks: Use real browser with BrowseTheWeb ability
 */
class ShareThriftCast implements Cast {
	constructor(
		private readonly tasksLevel: 'domain' | 'graphql' | 'dom',
		private readonly apiUrl: string,
		private readonly baseUrl: string,
		private browser?: Browser,
	) {}

	prepare(actor: Actor): Actor {
		switch (this.tasksLevel) {
			case 'domain':
				// Domain assembly: Pure business logic (fastest)
				// Direct access to domain layer without any I/O
				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					CreateListingAbility.using(
						{} as any, // Mock UOW - TODO: Replace with real MongoDB Memory Server
						{} as any, // Mock User
						{} as any, // Mock Passport
					),
				);

		case 'graphql': {
			// Session assembly: Uses Session abstraction (MockGraphQL)
			// Following Aslak's pattern: Session = abstraction UI code uses
			// Could be swapped with HttpSession for real GraphQL calls
			actor.whoCan(
				TakeNotes.using(Notepad.empty()),
				MockGraphQL.withMockedResponses(),
			);
			return actor;
		}

			case 'dom': {
			// DOM assembly: Real browser automation
			// Requires UI application running at baseUrl (typically https://localhost:3000)
			if (!this.browser) {
				throw new Error(
					'Browser not initialized for DOM testing. Call world.init() in Before hook.',
				);
			}
			
			return actor.whoCan(
				TakeNotes.using(Notepad.empty()),
				BrowseTheWebWithPlaywright.using(this.browser, {
					baseURL: this.baseUrl,
					ignoreHTTPSErrors: true, // For local Vite HTTPS dev server
				}),
				// DOM tasks use mocked GraphQL backend (no real API needed)
				MockGraphQL.withMockedResponses(),
			);
		}			default:
				throw new Error(`Unknown testing level: ${this.tasksLevel}`);
		}
	}
}

/**
 * Custom World implementation following Aslak Hellesøy's Screenplay Pattern.
 *
 * Sets up actors with abilities based on testing level:
 * - domain: Pure business logic
 * - graphql: Session abstraction (mocked GraphQL API)
 * - dom: Real browser + running UI application (requires localhost:3000)
 */
export class ShareThriftWorld extends World<WorldParameters> {
	private readonly tasksLevel: 'domain' | 'graphql' | 'dom';
	private readonly apiUrl: string;
	private readonly baseUrl: string;
	private browser?: Browser;

	constructor(options: IWorldOptions<WorldParameters>) {
		super(options);
		// Get testing level from world parameters (default: domain)
		this.tasksLevel = options.parameters?.tasks || 'domain';
		this.apiUrl = options.parameters?.apiUrl || 'http://localhost:7071/api/graphql';
		this.baseUrl = options.parameters?.baseUrl || 'https://localhost:3000';
	}

	/**
	 * Initialize browser for DOM testing.
	 * 
	 * For DOM tests, launches a headless browser.
	 * Assumes the UI application is already running at baseUrl.
	 */
	async init(): Promise<void> {
		if (this.tasksLevel === 'dom' && !this.browser) {
			// Launch browser with dev server auto-start
			this.browser = await chromium.launch({ 
				headless: true,
			});
		}

		// Configure Serenity/JS with our custom cast
		configure({
			actors: new ShareThriftCast(this.tasksLevel, this.apiUrl, this.baseUrl, this.browser),
			crew: [
				// Add reporters/crew members here if needed
			],
		});
	}

	/**
	 * Cleanup browser after DOM testing
	 */
	async cleanup(): Promise<void> {
		if (this.browser) {
			await this.browser.close();
			this.browser = undefined;
		}
	}

	/**
	 * Get the current assembly configuration
	 */
	get level(): 'domain' | 'graphql' | 'dom' {
		return this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
