import { Ability, type Actor } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { chromium, firefox, webkit, type Browser, type BrowserContext, type Page } from '@playwright/test';

/**
 * BrowseTheWeb enables an Actor to interact with web pages using Playwright.
 *
 * Used at DOM level for browser automation tests.
 */
export class BrowseTheWeb extends Ability {
	private browser?: Browser;
	private context?: BrowserContext;
	private currentPage?: Page;

	constructor(private readonly browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium') {
		super();
	}

	/**
	 * Initialize the browser and create a new page
	 */
	async initialize(): Promise<void> {
		const browserEngine =
			this.browserType === 'firefox' ? firefox : this.browserType === 'webkit' ? webkit : chromium;

		this.browser = await browserEngine.launch({
			headless: true,
		});

		this.context = await this.browser.newContext();
		this.currentPage = await this.context.newPage();
	}

	/**
	 * Get the current page
	 */
	async page(): Promise<Page> {
		if (!this.currentPage) {
			await this.initialize();
		}
		return this.currentPage!;
	}

	/**
	 * Navigate to a URL
	 */
	async navigateTo(url: string): Promise<void> {
		const page = await this.page();
		await page.goto(url);
	}

	/**
	 * Close the browser
	 */
	async close(): Promise<void> {
		await this.context?.close();
		await this.browser?.close();
	}

	/**
	 * Factory method to create this ability
	 */
	static using(browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium'): BrowseTheWeb {
		return new BrowseTheWeb(browserType);
	}

	/**
	 * Get this ability from an actor
	 */
	static as(actor: Actor): BrowseTheWeb {
		return actor.abilityTo(BrowseTheWeb);
	}
}
