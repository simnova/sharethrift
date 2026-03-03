import { Ability, type Actor } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright as SerenityBrowser } from '@serenity-js/playwright';
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';

/**
 * BrowseTheWebWithPlaywright - Real browser testing with Playwright
 *
 * This ability launches a real Chromium browser (headless) and drives it via Playwright.
 * Unlike happy-dom, this tests actual rendering, CSS, layout, and Ant Design styling.
 *
 * Used in the "dom-playwright" assembly for full confidence in real component behavior.
 * Same step definitions as happy-dom, but with real browser confidence.
 */
export class BrowseTheWebWithPlaywright extends Ability {
	private browser: Browser | null = null;
	private context: BrowserContext | null = null;
	private page: Page | null = null;
	private baseUrl: string = 'http://localhost:3000';

	/**
	 * Factory method following Serenity/JS Ability pattern
	 */
	static usingChromium(): BrowseTheWebWithPlaywright {
		return new BrowseTheWebWithPlaywright();
	}

	/**
	 * Get the ability from an actor
	 */
	static as(actor: Actor): BrowseTheWebWithPlaywright {
		return actor.abilityTo(BrowseTheWebWithPlaywright);
	}

	/**
	 * Initialize Chromium browser (once per test)
	 */
	private async initializeBrowser(): Promise<void> {
		if (this.page) {
			return; // Already initialized
		}

		this.browser = await chromium.launch({
			headless: true,
		});

		this.context = await this.browser.newContext();
		this.page = await this.context.newPage();

		// Set a reasonable viewport
		await this.page.setViewportSize({ width: 1280, height: 720 });

		console.log('[BrowseTheWebWithPlaywright] Browser initialized');
	}

	/**
	 * Navigate to a URL
	 */
	async goto(url: string): Promise<void> {
		if (!this.page) {
			await this.initializeBrowser();
		}
		await this.page!.goto(url);
		console.log(`[BrowseTheWebWithPlaywright] Navigated to ${url}`);
	}

	/**
	 * Render a React component by navigating to it
	 * For testing, we'll navigate to a test URL that renders the component
	 */
	async renderComponent(componentUrl: string = this.baseUrl): Promise<void> {
		if (!this.page) {
			await this.initializeBrowser();
		}
		await this.page!.goto(componentUrl);
		console.log('[BrowseTheWebWithPlaywright] Component page loaded');
	}

	/**
	 * Query elements by selector
	 */
	querySelector(selector: string) {
		if (!this.page) {
			throw new Error('Page not initialized');
		}
		return this.page.locator(selector);
	}

	/**
	 * Query element by test ID
	 */
	getByTestId(testId: string) {
		if (!this.page) {
			throw new Error('Page not initialized');
		}
		return this.page.getByTestId(testId);
	}

	/**
	 * Query element by label text
	 */
	getByLabel(text: string) {
		if (!this.page) {
			throw new Error('Page not initialized');
		}
		return this.page.getByLabel(text);
	}

	/**
	 * Fill a form field
	 */
	async fillField(selector: string, value: string): Promise<void> {
		if (!this.page) {
			throw new Error('Page not initialized');
		}
		await this.page.fill(selector, value);
	}

	/**
	 * Select a value from a dropdown
	 */
	async selectOption(selector: string, value: string): Promise<void> {
		if (!this.page) {
			throw new Error('Page not initialized');
		}
		await this.page.selectOption(selector, value);
	}

	/**
	 * Click an element
	 */
	async clickElement(selector: string): Promise<void> {
		if (!this.page) {
			throw new Error('Page not initialized');
		}
		await this.page.click(selector);
	}

	/**
	 * Get text content of an element
	 */
	async getTextContent(selector: string): Promise<string> {
		if (!this.page) {
			throw new Error('Page not initialized');
		}
		return (await this.page.textContent(selector)) || '';
	}

	/**
	 * Wait for an element to be visible
	 */
	async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
		if (!this.page) {
			throw new Error('Page not initialized');
		}
		await this.page.waitForSelector(selector, { timeout });
	}

	/**
	 * Wait for a condition
	 */
	async waitFor(
		condition: () => Promise<boolean>,
		timeout: number = 5000,
	): Promise<void> {
		const startTime = Date.now();
		while (!(await condition())) {
			if (Date.now() - startTime > timeout) {
				throw new Error(`Timeout waiting for condition after ${timeout}ms`);
			}
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}

	/**
	 * Take a screenshot for debugging
	 */
	async screenshot(name: string): Promise<void> {
		if (!this.page) {
			throw new Error('Page not initialized');
		}
		await this.page.screenshot({ path: `./reports/screenshots/${name}.png` });
		console.log(`[BrowseTheWebWithPlaywright] Screenshot saved: ${name}`);
	}

	/**
	 * Execute JavaScript in the browser context
	 */
	async evaluate<R>(pageFunction: () => R | Promise<R>): Promise<R> {
		if (!this.page) {
			throw new Error('Page not initialized');
		}
		return await this.page.evaluate(pageFunction);
	}

	/**
	 * Clean up - close browser
	 */
	async cleanup(): Promise<void> {
		if (this.page) {
			await this.page.close();
			this.page = null;
		}

		if (this.context) {
			await this.context.close();
			this.context = null;
		}

		if (this.browser) {
			await this.browser.close();
			this.browser = null;
		}

		console.log('[BrowseTheWebWithPlaywright] Browser closed');
	}
}
