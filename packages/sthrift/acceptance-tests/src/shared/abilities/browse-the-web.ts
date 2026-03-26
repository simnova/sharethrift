import { Ability, type Actor } from '@serenity-js/core';
import type { Browser, BrowserContext, Page } from '@playwright/test';

// Module-level reference updated each scenario.
// This avoids issues with Serenity.js actor caching — actors are created
// once and reused, so we can't rely on per-actor ability instances staying
// in sync with per-scenario browser contexts.
let activeBrowseTheWeb: BrowseTheWeb | undefined;

/**
 * Serenity.js Ability that wraps a Playwright Page for E2E browser interactions.
 *
 * Usage in Cast:
 *   actor.whoCan(BrowseTheWeb.using(page, context))
 *
 * Usage in Tasks:
 *   const { page } = BrowseTheWeb.as(actor);
 *   await page.goto('/create-listing');
 */
export class BrowseTheWeb extends Ability {
	readonly page: Page;
	private readonly context: BrowserContext;

	static using(page: Page, context: BrowserContext): BrowseTheWeb {
		const ability = new BrowseTheWeb(page, context);
		activeBrowseTheWeb = ability;
		return ability;
	}

	/**
	 * Returns the BrowseTheWeb ability for the current scenario.
	 * Uses the module-level active instance rather than the actor's cached abilities
	 * to work around Serenity.js's actor caching between scenarios.
	 */
	static as(_actor: Actor): BrowseTheWeb {
		if (!activeBrowseTheWeb) {
			throw new Error('No BrowseTheWeb ability is active — ensure the E2E infrastructure was started');
		}
		return activeBrowseTheWeb;
	}

	private constructor(page: Page, context: BrowserContext) {
		super();
		this.page = page;
		this.context = context;
	}

	async close(): Promise<void> {
		await this.page.close();
		await this.context.close();
		if (activeBrowseTheWeb === this) {
			activeBrowseTheWeb = undefined;
		}
	}
}

/**
 * Shared browser instance for E2E tests.
 * Launched once per test run, closed in AfterAll hook.
 */
export interface SharedBrowserState {
	browser: Browser;
	baseUrl: string;
}
