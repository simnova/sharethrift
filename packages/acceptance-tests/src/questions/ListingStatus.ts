import { Question, type Actor, notes } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { MockBrowser } from '../abilities/MockBrowser.js';

/**
 * ListingStatus is a Question that retrieves the status of a listing.
 *
 * Works at all testing levels:
 * - domain/session: Retrieved from actor notes
 * - dom: Retrieved from DOM via browser
 *
 * Questions are used in assertions to query the current state.
 * They work across all testing levels (domain/graphql/dom).
 */
export class ListingStatus extends Question<string> {
	constructor(private readonly source: 'notes' | 'dom' = 'auto') {
		super('listing status');
	}

	/**
	 * Retrieve the listing status based on the current testing level
	 * Auto-detects between notes (domain/session) and DOM (dom level)
	 */
	async answeredBy(actor: Actor): Promise<string> {
		// Auto-detect based on actor abilities
		let source = this.source;
		if (source === 'auto') {
			// Check for DOM browser (mock or real)
			if (MockBrowser.current()) {
				source = 'dom';
			} else {
				try {
					BrowseTheWebWithPlaywright.as(actor);
					source = 'dom';
				} catch {
					source = 'notes';
				}
			}
		}

		if (source === 'dom') {
			return this.fromDOMSource(actor);
		}

		// Default to notes (domain/session levels)
		return actor.answer(notes<{ lastListingStatus: string }>().get('lastListingStatus'));
	}

	/**
	 * Retrieve status from DOM
	 */
	private async fromDOMSource(actor: Actor): Promise<string> {
		try {
			let page: any;

			// Try mock browser first
			let mockBrowser = MockBrowser.current();
			if (mockBrowser) {
				page = mockBrowser.currentPage();
			} else {
				// Fall back to real browser
				page = BrowseTheWebWithPlaywright.as(actor).currentPage();
			}

			// Get status from badge element
			let status = await page.textContent('[data-testid="listing-status-badge"]');

			// Fallback: check in status section
			if (!status) {
				status = await page.textContent('[data-testid="listing-status"]');
			}

			return status?.trim().toLowerCase() || '';
		} catch (error) {
			throw new Error(`Failed to retrieve listing status from DOM: ${error}`);
		}
	}

	/**
	 * Factory method to create this question for an actor
	 */
	static of(): ListingStatus {
		return new ListingStatus();
	}

	/**
	 * Create question that forces retrieval from DOM
	 */
	static fromDOM(): ListingStatus {
		return new ListingStatus('dom');
	}

	/**
	 * Create question that forces retrieval from notes
	 */
	static fromNotes(): ListingStatus {
		return new ListingStatus('notes');
	}

	toString(): string {
		return 'the listing status';
	}
}
