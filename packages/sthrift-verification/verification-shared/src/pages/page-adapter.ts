/**
 * Universal element handle — wraps a single DOM element or Playwright locator.
 * Provides a common interface for both jsdom (acceptance-test UI) and Playwright (e2e) contexts.
 */
export interface ElementHandle {
	/** Fire a change event (for inputs/textareas). */
	fill(value: string): Promise<void>;
	/** Click the element. */
	click(): Promise<void>;
	/** Check a checkbox or radio input. */
	check(): Promise<void>;
	/** Get the text content. */
	textContent(): Promise<string | null>;
	/** Get an attribute value. */
	getAttribute(name: string): Promise<string | null>;
	/** Check whether the element exists / is visible. */
	isVisible(): Promise<boolean>;
	/** Wait for the element to reach a given state. No-op in jsdom. */
	waitFor(options?: { state?: 'visible' | 'hidden' | 'attached' | 'detached'; timeout?: number }): Promise<void>;
	/** Query a single descendant by CSS selector. */
	querySelector(selector: string): Promise<ElementHandle | null>;
	/** Query all descendants by CSS selector. */
	querySelectorAll(selector: string): Promise<ElementHandle[]>;
}

export type PageNavigationWaitUntil =
	| 'load'
	| 'domcontentloaded'
	| 'networkidle'
	| 'commit';

export type PageUrlMatcher =
	| string
	| RegExp
	| ((url: URL) => boolean);

/**
 * Universal page adapter — abstracts element lookup across jsdom and Playwright.
 * Page objects depend on this interface rather than a specific test runner.
 */
export interface PageAdapter {
	/** Find by placeholder text (inputs/textareas). */
	getByPlaceholder(text: string): ElementHandle;
	/** Find by associated label text. */
	getByLabel(text: string): ElementHandle;
	/** Find by accessible role and optional name. */
	getByRole(role: string, options?: { name?: string | RegExp }): ElementHandle;
	/** Find by CSS selector. */
	locator(selector: string): ElementHandle;
	/** Find all matching elements by CSS selector. */
	locatorAll(selector: string): Promise<ElementHandle[]>;
	/** Find by text content within a given selector scope. */
	getByText(
		text: string | RegExp,
		options?: { selector?: string },
	): ElementHandle;
	/** Navigate to a new URL. */
	goto(
		url: string,
		options?: { timeout?: number; waitUntil?: PageNavigationWaitUntil },
	): Promise<void>;
	/** Wait until the page URL matches. */
	waitForURL(
		url: PageUrlMatcher,
		options?: { timeout?: number; waitUntil?: PageNavigationWaitUntil },
	): Promise<void>;
	/** Read the current page URL. */
	url(): string;
	/** Wait for a timeout in environments that support it. */
	waitForTimeout(timeout: number): Promise<void>;
}

export type PageAdapterMode = 'jsdom' | 'playwright';
