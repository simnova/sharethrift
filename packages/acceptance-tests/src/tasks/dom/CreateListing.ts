import { Task, type Actor } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { MockBrowser } from '../../abilities/MockBrowser.js';
import { getSession } from '../../abilities/Session.js';

interface ListingNotes {
	lastListingId: string;
	lastListingTitle: string;
	lastListingStatus: string;
}

export interface ListingDetails {
	title: string;
	description: string;
	category: string;
	location: string;
	dailyRate?: string;
	weeklyRate?: string;
	deposit?: string;
	tags?: string;
}

/**
 * CreateListing task for DOM level.
 *
 * Works with both real browser (BrowseTheWebWithPlaywright) and mock browser (MockBrowser).
 */
export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`creates listing "${details.title}" (DOM)`);
	}

	async performAs(actor: Actor): Promise<void> {
		// Try to get the CURRENT mock browser first (not from actor, since actor might have stale reference)
		let page: any;
		let mockBrowser = MockBrowser.current();
		
		if (mockBrowser) {
			page = mockBrowser.currentPage();
		} else {
			// Fall back to getting from actor abilities
			try {
				mockBrowser = MockBrowser.as(actor);
				page = mockBrowser.currentPage();
			} catch {
				// If not available, try real browser
				const browser = BrowseTheWebWithPlaywright.as(actor);
				page = await browser.currentPage();
			}
		}

		// Navigate to create listing page
		await page.goto('/listings/create', { waitUntil: 'networkidle' });

		try {
			// Fill required fields
			await page.fill('[data-testid="listing-form-title"]', this.details.title);
			await page.fill('[data-testid="listing-form-description"]', this.details.description);

			// Select category from dropdown
			await page.click('[data-testid="listing-form-category"]');
			await page.click(`[data-testid="category-option-${this.normalizeValue(this.details.category)}"]`);

			// Fill location
			await page.fill('[data-testid="listing-form-location"]', this.details.location);

			// Fill optional fields if provided
			if (this.details.dailyRate) {
				await page.fill('[data-testid="listing-form-daily-rate"]', this.details.dailyRate);
			}
			if (this.details.weeklyRate) {
				await page.fill('[data-testid="listing-form-weekly-rate"]', this.details.weeklyRate);
			}
			if (this.details.deposit) {
				await page.fill('[data-testid="listing-form-deposit"]', this.details.deposit);
			}
			if (this.details.tags) {
				await page.fill('[data-testid="listing-form-tags"]', this.details.tags);
			}

			// Submit form (as draft)
			await page.click('[data-testid="listing-form-save-draft"]');

			// Wait for success message or redirect to listing details
			await page.waitForSelector(
				'[data-testid="listing-created-success"], [data-testid="listing-details-view"]',
				{ timeout: 5000 },
			);

			// Extract listing ID from URL or success message
			const listingId = await this.extractListingId(page);

			// Store in actor notes for later steps
			// Note: In DOM tests, we might want to navigate to view the listing
			// to verify it was created correctly through the UI
			console.log(`[DOM] Created listing via UI: ${this.details.title} (ID: ${listingId})`);
		} catch (error) {
			// Check if there's a validation error displayed in the UI
			const errorElement = await page.$('[data-testid="form-error-message"]');
			if (errorElement) {
				const errorMessage = await errorElement.textContent();
				throw new Error(errorMessage || String(error));
			}

			// Re-throw if no UI error found
			throw error;
		}
	}

	/**
	 * Extract listing ID from success message or URL
	 */
	private async extractListingId(page: any): Promise<string> {
		// Try to get from URL (if redirect happened)
		const url = page.url();
		const match = url.match(/\/listings\/([a-zA-Z0-9-]+)/);
		if (match) {
			return match[1];
		}

		// Try to get from success message attribute
		const successMessage = await page.getAttribute('[data-testid="listing-created-success"]', 'data-listing-id');
		if (successMessage) {
			return successMessage;
		}

		// Fallback: extract from hidden input or return placeholder
		return 'unknown';
	}

	/**
	 * Normalize category/option values for test selectors
	 * Converts "Electronics" to "electronics", "Sports Equipment" to "sports-equipment"
	 */
	private normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s+/g, '-');
	}

	toString = () => `creates listing "${this.details.title}" (DOM)`;
}
