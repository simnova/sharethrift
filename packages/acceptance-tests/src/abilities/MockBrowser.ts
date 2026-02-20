import { Ability, type Actor } from '@serenity-js/core';

// Global storage for current MockBrowser instance per test
let currentMockBrowserInstance: MockBrowser | undefined;

/**
 * MockBrowser - Simulates browser interactions for testing without a real UI server
 *
 * Useful for DOM-level tests when:
 * - Running in CI/CD without UI server
 * - Testing form logic without full browser
 * - Development/rapid iteration
 *
 * Limitations:
 * - No actual DOM rendering
 * - No real browser events
 * - No JavaScript execution
 *
 * For real browser testing, use BrowseTheWebWithPlaywright instead.
 */
export class MockBrowser extends Ability {
	private mockPage: MockPage;
	readonly id: string;

	constructor() {
		super();
		this.id = Math.random().toString(36).substring(7);
		this.mockPage = new MockPage();
		console.log(`[MockBrowser] New MockBrowser instance created with MockPage (ID: ${this.id})`);
		// Store globally so tasks and questions can access it
		currentMockBrowserInstance = this;
	}

	static using(): MockBrowser {
		const browser = new MockBrowser();
		console.log(`[MockBrowser.using] Created new MockBrowser via static method (ID: ${browser.id})`);
		return browser;
	}

	/**
	 * Get the current MockBrowser instance globally
	 * This is used by tasks and questions to access the browser without needing to get it from the actor
	 */
	static current(): MockBrowser | undefined {
		return currentMockBrowserInstance;
	}

	currentPage(): MockPage {
		console.log(`[MockBrowser.currentPage] Called on instance ${this.id}`);
		return this.mockPage;
	}

	static as(actor: Actor): MockBrowser {
		const browser = actor.abilityTo(MockBrowser);
		console.log(`[MockBrowser.as] Retrieved MockBrowser instance (ID: ${browser.id}):`, browser);
		return browser;
	}
}

/**
 * MockPage - Simulates a Playwright Page object
 */
export class MockPage {
	private formData = new Map<string, string>();
	private errorMessages = new Map<string, string>();
	private currentUrl = '';
	private uiState = new Map<string, string>();

	async goto(url: string, options?: any): Promise<void> {
		this.currentUrl = url;
		console.log(`[MockBrowser] Navigated to ${url}`);
	}

	url(): string {
		return this.currentUrl;
	}

	async fill(selector: string, value: string): Promise<void> {
		this.formData.set(selector, value);
		console.log(`[MockBrowser] Filled ${selector} with "${value}"`);
	}

	async click(selector: string): Promise<void> {
		console.log(`[MockBrowser] Clicked ${selector}`);

		// Handle category dropdown selection
		if (selector.includes('category-option-')) {
			const categoryMatch = selector.match(/category-option-(.+)/);
			if (categoryMatch) {
				const category = categoryMatch[1];
				this.formData.set('[data-testid="listing-form-category"]', category);
				console.log(`[MockBrowser] Selected category: ${category}`);
			}
		}

		// Simulate form submission on save button
		if (selector.includes('save-draft') || selector.includes('submit')) {
			console.log(`[MockBrowser] Form submission detected, validating...`);
			await this.validateForm();
		}
	}

	async textContent(selector: string): Promise<string | null> {
		// Check UI state first (for display elements like status badge)
		if (this.uiState.has(selector)) {
			return this.uiState.get(selector) || '';
		}

		// If asking for form field value, return what was filled
		if (this.formData.has(selector)) {
			return this.formData.get(selector) || '';
		}

		// Return empty for display elements (they don't have content in mock)
		return '';
	}

	async getAttribute(selector: string, attribute: string): Promise<string | null> {
		// Support extracting listing ID from success message
		if (selector.includes('success') && attribute === 'data-listing-id') {
			return 'mock-listing-123';
		}
		return null;
	}

	async $(selector: string): Promise<MockElement | null> {
		// Check if error exists for field
		if (selector.includes('error-')) {
			const fieldName = selector.match(/error-(.+)/)?.[1];
			if (fieldName && this.errorMessages.has(fieldName)) {
				return new MockElement(this.errorMessages.get(fieldName) || '');
			}
			return null;
		}

		// Always return element for other selectors (simulates "found")
		return new MockElement('');
	}

	async $$(selector: string): Promise<MockElement[]> {
		// Return list of errors for field errors
		if (selector.includes('error-')) {
			const errors = Array.from(this.errorMessages.values()).map(msg => new MockElement(msg));
			return errors;
		}
		return [];
	}

	async waitForSelector(selector: string, options?: any): Promise<MockElement | null> {
		// Simulate waiting for element
		return new MockElement('');
	}

	async waitForTimeout(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async screenshot(options?: any): Promise<void> {
		console.log(`[MockBrowser] Screenshot: ${options?.path || 'screenshot.png'}`);
	}

	async pause(): Promise<void> {
		console.log('[MockBrowser] Paused (no-op in mock)');
	}

	// Helper for validation
	private async validateForm(): Promise<void> {
		this.errorMessages.clear();

		const title = this.formData.get('[data-testid="listing-form-title"]');
		const description = this.formData.get('[data-testid="listing-form-description"]');
		const category = this.formData.get('[data-testid="listing-form-category"]');
		const location = this.formData.get('[data-testid="listing-form-location"]');

		// Validate required fields
		if (!title) {
			this.errorMessages.set('title', 'Title is required');
		} else if (title.length < 5) {
			this.errorMessages.set('title', 'Title must be at least 5 characters');
		} else if (title.length > 100) {
			this.errorMessages.set('title', 'Title cannot exceed 100 characters');
		}

		if (!description) {
			this.errorMessages.set('description', 'Description is required');
		}

		if (!category) {
			this.errorMessages.set('category', 'Category is required');
		}

		if (!location) {
			this.errorMessages.set('location', 'Location is required');
		}

		console.log(`[MockBrowser] Form validation complete. Errors:`, Object.fromEntries(this.errorMessages));

		// If validation passed, simulate successful form submission
		if (this.errorMessages.size === 0) {
			// Set UI state to show listing was created in draft status
			this.uiState.set('[data-testid="listing-status-badge"]', 'draft');
			this.uiState.set('[data-testid="listing-status"]', 'draft');
			console.log(`[MockBrowser] Form submission successful, setting listing status to draft`);
		}
	}

	// Debug helper
	getFormData(): Record<string, string> {
		return Object.fromEntries(this.formData);
	}

	getErrors(): Record<string, string> {
		const result = Object.fromEntries(this.errorMessages);
		console.log(`[MockPage] getErrors() called. errorMessages Map size: ${this.errorMessages.size}, result:`, result);
		return result;
	}
}

/**
 * MockElement - Simulates a Playwright ElementHandle
 */
export class MockElement {
	constructor(private content: string = '') {}

	async textContent(): Promise<string | null> {
		return this.content;
	}

	async getAttribute(name: string): Promise<string | null> {
		return null;
	}
}
