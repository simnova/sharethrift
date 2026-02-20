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
import { GraphQLSession } from '../abilities/GraphQLSession.js';
import { MockBrowser } from '../abilities/MockBrowser.js';
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
	// Store a reference to the current MockBrowser globally so actors use the latest one
	private static currentMockBrowser: MockBrowser | undefined;

	constructor(
		private readonly tasksLevel: 'domain' | 'session' | 'dom',
		private readonly sessionType: 'domain' | 'http',
		private readonly apiUrl: string,
		private readonly baseUrl: string,
		private browser?: Browser,
		private useMockBrowser: boolean = false,
		private mockBrowserInstance?: MockBrowser,
	) {
		// Update the global reference whenever Cast is created
		if (this.useMockBrowser && mockBrowserInstance) {
			ShareThriftCast.currentMockBrowser = mockBrowserInstance;
			console.log(`[Cast.constructor] Updated currentMockBrowser to:`, mockBrowserInstance.id);
		}
	}

	prepare(actor: Actor): Actor {
		switch (this.tasksLevel) {
			case 'domain':
				return actor.whoCan(
					TakeNotes.using(Notepad.empty()),
					CreateListingAbility.using({} as any, {} as any, {} as any),
				);

			case 'session': {
				const session =
					this.sessionType === 'http'
						? GraphQLSession.at(this.apiUrl)
						: DomainSession.withDirectDomainAccess();

				return actor.whoCan(TakeNotes.using(Notepad.empty()), session);
			}

			case 'dom': {
				const session =
					this.sessionType === 'http'
						? GraphQLSession.at(this.apiUrl)
						: DomainSession.withDirectDomainAccess();

				if (this.useMockBrowser) {
					// Use the CURRENT MockBrowser (not the one from this cast instance)
					// This ensures actors always use the latest MockBrowser for the current scenario
					const browserToUse = ShareThriftCast.currentMockBrowser || this.mockBrowserInstance;
					if (!browserToUse) {
						throw new Error('MockBrowser instance not initialized in Cast');
					}
					console.log(`[Cast.prepare] Adding MockBrowser ability to actor (ID: ${browserToUse.id}):`, browserToUse);
					return actor.whoCan(
						TakeNotes.using(Notepad.empty()),
						browserToUse,
						session,
					);
				}

				if (!this.browser) {
					throw new Error(
						'Browser not initialized for DOM testing. Call world.init() in Before hook.',
					);
				}

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
	private useMockBrowser: boolean = true;
	private mockBrowser?: MockBrowser;

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

		// For DOM tests: use mock browser by default, real browser if USE_REAL_BROWSER is set
		if (this.tasksLevel === 'dom') {
			if (process.env.USE_REAL_BROWSER) {
				// Launch real browser for actual UI testing
				const isCI = this.isRunningInCI();
				const headlessEnv = process.env.HEADLESS?.toLowerCase();
				const headless = headlessEnv !== undefined ? headlessEnv === 'true' : isCI;

				this.browser = await chromium.launch({
					headless,
				});

				this.useMockBrowser = false;
				console.log(`[WORLD] Real browser started (headless: ${headless})`);
			} else {
				// Use mock browser (default) - no real browser needed
				this.useMockBrowser = true;
				// Create mock browser instance once per scenario (reused across steps)
				if (!this.mockBrowser) {
					this.mockBrowser = MockBrowser.using();
				}
				console.log('[WORLD] Using mock browser for DOM tests');
			}
		}

		const cast = new ShareThriftCast(
			this.tasksLevel,
			this.sessionType,
			this.apiUrl,
			this.baseUrl,
			this.browser,
			this.useMockBrowser,
			this.mockBrowser,
		);

		configure({
			actors: cast,
			crew: [],
		});

		console.log(`[WORLD] Configured Cast with mock browser:`, this.mockBrowser, `(useMockBrowser: ${this.useMockBrowser})`);
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

		// Reset mock browser for next scenario
		if (this.mockBrowser) {
			this.mockBrowser = undefined;
		}
	}

	get level(): 'domain' | 'session' | 'dom' {
		return this.tasksLevel;
	}

	/**
	 * Detect if tests are running in a CI environment
	 * Checks for common CI environment variables
	 */
	private isRunningInCI(): boolean {
		return !!(
			process.env.CI ||
			process.env.GITHUB_ACTIONS ||
			process.env.GITLAB_CI ||
			process.env.TF_BUILD || // Azure Pipelines
			process.env.CIRCLECI ||
			process.env.JENKINS_URL ||
			process.env.TRAVIS
		);
	}
}

setWorldConstructor(ShareThriftWorld);
