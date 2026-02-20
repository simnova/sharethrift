import { Question, type Actor, notes } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { MockBrowser } from '../abilities/MockBrowser.js';

/**
 * ListingTitle question - gets the title of the last created listing.
 *
 * Works at all testing levels:
 * - domain/session: Retrieved from actor notes
 * - dom: Retrieved from DOM via browser (real or mock)
 *
 * Automatically detects which level based on actor abilities.
 */
export class ListingTitle extends Question<string> {
	constructor(private readonly source: 'notes' | 'dom' = 'auto') {
		super('listing title');
	}

	/**
	 * Get the displayed title (auto-detects source based on actor abilities)
	 */
	static displayed() {
		return new ListingTitle('auto');
	}

	/**
	 * Force retrieval from actor notes (domain/session levels)
	 */
	static fromNotes() {
		return new ListingTitle('notes');
	}

	/**
	 * Force retrieval from DOM (dom level)
	 */
	static fromDOM() {
		return new ListingTitle('dom');
	}

	async answeredBy(actor: Actor): Promise<string> {
		// Auto-detect based on actor abilities
		let source = this.source;
		if (source === 'auto') {
			// Check for DOM browser (mock or real)
			if (MockBrowser.current()) {
				source = 'dom';
			} else {
				try {
					MockBrowser.as(actor);
					source = 'dom';
				} catch {
					try {
						BrowseTheWebWithPlaywright.as(actor);
						source = 'dom';
					} catch {
						source = 'notes';
					}
				}
			}
		}

		if (source === 'dom') {
			return this.fromDOMSource(actor);
		}

		// Default to notes
		return actor.answer(notes<{ lastListingTitle: string }>().get('lastListingTitle'));
	}

	/**
	 * Retrieve title from DOM (real or mock browser)
	 */
	private async fromDOMSource(actor: Actor): Promise<string> {
		try {
			// Try mock browser first (use current global instance)
			let mockBrowser = MockBrowser.current();
			if (!mockBrowser) {
				try {
					mockBrowser = MockBrowser.as(actor);
				} catch {
					// Mock browser not available
				}
			}

			if (mockBrowser) {
				const page = mockBrowser.currentPage();
				const formData = (page as any).getFormData?.();
				if (formData?.['[data-testid="listing-form-title"]']) {
					return formData['[data-testid="listing-form-title"]'];
				}
			}

			// Try real browser
			const browser = BrowseTheWebWithPlaywright.as(actor);
			const page = await browser.currentPage();

			// Get title from current page (listing details or created confirmation)
			let title = await page.textContent('[data-testid="listing-title-display"]');

			// Fallback: check in heading
			if (!title) {
				title = await page.textContent('h1[data-testid="listing-title"]');
			}

			return title?.trim() || '';
		} catch (error) {
			throw new Error(`Failed to retrieve listing title from DOM: ${error}`);
		}
	}

	toString = () => 'listing title';
}
