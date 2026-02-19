import { Ability, type Actor } from '@serenity-js/core';
import type { Session, CreateItemListingInput, ItemListing } from './Session.js';

/**
 * DomainSession - talks directly to the domain layer with direct function calls (no networking).
 *
 * Following Screenplay.js design recommendations:
 * "The DomainSession is an implementation that talks directly to the server side domain layer
 *  with direct function calls (without any networking). This implementation will only be used in tests."
 *
 * Benefits:
 * - Fastest tests (runs in milliseconds)
 * - No network overhead
 * - No HTTP server needed
 * - Tests domain layer coverage only
 *
 * This is for TESTING ONLY - production code uses HttpSession.
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export class DomainSession extends Ability implements Session {
	private listings = new Map<string, ItemListing>();
	private nextId = 1;

	/**
	 * Factory method following Serenity/JS Ability pattern
	 */
	static withDirectDomainAccess(): DomainSession {
		return new DomainSession();
	}

	/**
	 * Create a listing by calling domain layer directly (no HTTP)
	 */
	async createItemListing(input: CreateItemListingInput): Promise<ItemListing> {
		// Validate input (domain validation rules)
		this.validateCreateInput(input);

		// Generate ID and create listing
		const id = `listing-${this.nextId++}`;
		const listing: ItemListing = {
			id,
			title: input.title,
			description: input.description,
			category: input.category,
			location: input.location,
			state: input.isDraft ? 'draft' : 'published',
			sharingPeriodStart: input.sharingPeriodStart,
			sharingPeriodEnd: input.sharingPeriodEnd,
			images: input.images || [],
		};

		// Store in memory (simulating persistence)
		this.listings.set(id, listing);

		return listing;
	}

	/**
	 * Get listing by ID
	 */
	async getListingById(id: string): Promise<ItemListing | null> {
		return this.listings.get(id) || null;
	}

	/**
	 * Domain validation rules
	 */
	private validateCreateInput(input: CreateItemListingInput): void {
		if (!input.title) {
			throw new Error('Validation error: title is required');
		}
		if (input.title.length < 5) {
			throw new Error('Validation error: Title must be at least 5 characters');
		}
		if (input.title.length > 100) {
			throw new Error('Validation error: Title cannot exceed 100 characters');
		}
		if (!input.description) {
			throw new Error('Validation error: description is required');
		}
		if (!input.category) {
			throw new Error('Validation error: category is required');
		}
		if (!input.location) {
			throw new Error('Validation error: location is required');
		}
		if (!input.sharingPeriodStart) {
			throw new Error('Validation error: sharingPeriodStart is required');
		}
		if (!input.sharingPeriodEnd) {
			throw new Error('Validation error: sharingPeriodEnd is required');
		}
	}

	/**
	 * Required by Serenity/JS Ability interface
	 */
	static as(actor: Actor): DomainSession {
		return actor.abilityTo(DomainSession);
	}
}
