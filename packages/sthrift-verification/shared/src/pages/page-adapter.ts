/**
 * Universal element handle — wraps a single DOM element or Playwright locator.
 * Provides a common interface for both jsdom (acceptance-test UI) and Playwright (e2e) contexts.
 */
export interface ElementHandle {
	/** Fire a change event (for inputs/textareas). */
	fill(value: string): Promise<void>;
	/** Click the element. */
	click(): Promise<void>;
	/** Get the text content. */
	textContent(): Promise<string | null>;
	/** Get an attribute value. */
	getAttribute(name: string): Promise<string | null>;
	/** Check whether the element exists / is visible. */
	isVisible(): Promise<boolean>;
	/** Query a single descendant by CSS selector. */
	querySelector(selector: string): Promise<ElementHandle | null>;
	/** Query all descendants by CSS selector. */
	querySelectorAll(selector: string): Promise<ElementHandle[]>;
}

/**
 * Universal page adapter — abstracts element lookup across jsdom and Playwright.
 * Page objects depend on this interface rather than a specific test runner.
 */
export interface PageAdapter {
	/** Find by placeholder text (inputs/textareas). */
	getByPlaceholder(text: string): ElementHandle;
	/** Find by accessible role and optional name. */
	getByRole(role: string, options?: { name?: string | RegExp }): ElementHandle;
	/** Find by CSS selector. */
	locator(selector: string): ElementHandle;
	/** Find by text content within a given selector scope. */
	getByText(
		text: string | RegExp,
		options?: { selector?: string },
	): ElementHandle;
}

export type PageAdapterMode = 'jsdom' | 'playwright';
