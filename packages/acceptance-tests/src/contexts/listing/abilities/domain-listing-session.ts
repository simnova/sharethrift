import { DomainSession } from '../../../shared/abilities/domain-session.js';
import type { CreateItemListingInput, ItemListing } from './listing-session.js';

/**
 * DomainListingSession - Domain-specific implementation of listing operations over DomainSession.
 *
 * Extends generic DomainSession with listing-specific handlers.
 * Registers operation handlers in constructor and provides convenience methods.
 */
export class DomainListingSession extends DomainSession {
	private listings: Map<string, ItemListing>;
	private nextId = 1;
	context = 'listing';

	constructor(sharedStore?: Map<string, ItemListing>) {
		super();
		// Use provided shared store or create a new Map for this session
		this.listings = sharedStore || new Map<string, ItemListing>();
		// Register listing operations with the parent Session
		this.registerOperation('listing:create', (input) =>
			this.handleCreateListing(input as unknown as CreateItemListingInput),
		);
		this.registerOperation('listing:getById', (input) =>
			this.handleGetListingById(input as unknown as { id: string }),
		);
	}

	/**
	 * Convenience method: Create a listing
	 * (delegates to registered operation for backward compatibility)
	 */
	createItemListing(input: CreateItemListingInput): Promise<ItemListing> {
		return this.execute<CreateItemListingInput, ItemListing>('listing:create', input);
	}

	/**
	 * Convenience method: Get listing by ID
	 * (delegates to registered operation for backward compatibility)
	 */
	getListingById(id: string): Promise<ItemListing | null> {
		return this.execute<{ id: string }, ItemListing | null>('listing:getById', { id });
	}

	/**
	 * Handle creating a listing
	 */
	private handleCreateListing(input: CreateItemListingInput): Promise<ItemListing> {
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

		return Promise.resolve(listing);
	}

	/**
	 * Handle getting a listing by ID
	 */
	private handleGetListingById(input: { id: string }): Promise<ItemListing | null> {
		return Promise.resolve(this.listings.get(input.id) || null);
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
}
