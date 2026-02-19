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
import { DomainSession } from '../abilities/DomainSession.js';
import { HttpSession } from '../abilities/HttpSession.js';
import { TestServer } from './test-server.js';
import { createTestApplicationServicesFactory } from './test-application-services.js';

/**
 * World parameters passed via --world-parameters CLI flag
 *
 * Following Screenplay.js design recommendations:
 * - tasks: Which task implementation to use (domain/session/dom)
 * - session: Which Session implementation (domain/http)
 *
 * Assemblies (from Screenplay.js - 4 configurations):
 * 1. session tasks + DomainSession = Fastest tests (domain layer, milliseconds)
 * 2. session tasks + HttpSession = Slower tests (http + domain layer)
 * 3. dom tasks + DomainSession = Slower tests (UI + domain layer)
 * 4. dom tasks + HttpSession = Slowest tests (full stack: UI + http + domain)
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export interface WorldParameters {
	tasks: 'domain' | 'session' | 'dom';
	session?: 'domain' | 'http';
	apiUrl?: string;
	baseUrl?: string;
}

/**
 * Custom Cast that prepares actors with abilities based on testing level.
 */
class ShareThriftCast implements Cast {
	constructor(
private readonly tasksLevel: 'domain' | 'session' | 'dom',
private readonly sessionType: 'domain' | 'http',
private readonly apiUrl: string,
private readonly baseUrl: string,
private browser?: Browser,
) {}

	prepare(actor: Actor): Actor {
		switch (this.tasksLevel) {
			case 'domain':
				return actor.whoCan(
TakeNotes.using(Notepad.empty()),
					CreateListingAbility.using(
{} as any,
{} as any,
{} as any,
),
				);

			case 'session': {
				const session = this.sessionType === 'http'
					? HttpSession.at(this.apiUrl)
					: DomainSession.withDirectDomainAccess();

				return actor.whoCan(
TakeNotes.using(Notepad.empty()),
					session,
				);
			}

			case 'dom': {
				if (!this.browser) {
					throw new Error(
'Browser not initialized for DOM testing. Call world.init() in Before hook.',
);
				}

				const session = this.sessionType === 'http'
					? HttpSession.at(this.apiUrl)
					: DomainSession.withDirectDomainAccess();

				return actor.whoCan(
TakeNotes.using(Notepad.empty()),
					BrowseTheWebWithPlaywright.using(this.browser, {
baseURL: this.baseUrl,
ignoreHTTPSErrors: true,
}),
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
	private readonly sessionType: 'domain' | 'http';
	private readonly apiUrl: string;
	private readonly baseUrl: string;
	private browser?: Browser;
	private testServer?: TestServer;

	constructor(options: IWorldOptions<WorldParameters>) {
		super(options);
		this.tasksLevel = options.parameters?.tasks || 'domain';
		this.sessionType = options.parameters?.session || 'domain';
		this.apiUrl = options.parameters?.apiUrl || 'http://localhost:4000/graphql';
		this.baseUrl = options.parameters?.baseUrl || 'https://localhost:3000';
	}

	async init(): Promise<void> {
		// Start test server for HTTP session tests
		if (this.sessionType === 'http' && !this.testServer) {
			// Create test ApplicationServicesFactory with in-memory storage
			const testFactory = createTestApplicationServicesFactory();
			
			this.testServer = new TestServer(testFactory);
			const url = await this.testServer.start(4000);
			console.log(`[WORLD] Test server started at ${url}`);
		}

		// Start browser for DOM tests
		if (this.tasksLevel === 'dom' && !this.browser) {
			this.browser = await chromium.launch({ 
headless: true,
});
		}

		configure({
actors: new ShareThriftCast(
this.tasksLevel,
this.sessionType,
this.apiUrl,
this.baseUrl,
this.browser,
),
crew: [],
});
	}

	async cleanup(): Promise<void> {
		// Stop test server
		if (this.testServer) {
			await this.testServer.stop();
			this.testServer = undefined;
			console.log('[WORLD] Test server stopped');
		}

		// Close browser
		if (this.browser) {
			await this.browser.close();
			this.browser = undefined;
		}
	}

	get level(): 'domain' | 'session' | 'dom' {
		return this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
