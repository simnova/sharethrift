import { Task, type Actor, notes } from '@serenity-js/core';
import { CreateListingAbility } from '../../abilities/CreateListingAbility.js';

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
 * CreateListing task for DOMAIN level.
 *
 * Uses domain CreateListingAbility to create a listing directly.
 * This is the fastest test level - no HTTP or browser overhead.
 */
export interface CreateListingInput {
	title: string;
	description: string;
	category: string;
	location: string;
}

/**
 * CreateListing task for DOMAIN level.
 *
 * Uses domain CreateListingAbility to create a listing directly.
 * This is the fastest test level - no HTTP or browser overhead.
 */
export class CreateListing extends Task {
	static with(details: CreateListingInput) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: CreateListingInput) {
		super(`creates listing "${details.title}" (domain)`);
	}	async performAs(actor: Actor): Promise<void> {
		// Validate required fields
		this.validateDetails();

		// Use the CreateListingAbility to create the listing
		const ability = CreateListingAbility.as(actor);
		ability.createDraftListing(this.details);

		// Get the created listing and store in notes
		const listing = ability.getCreatedListing();
		if (listing) {
			await actor.attemptsTo(
				notes<ListingNotes>().set('lastListingId', listing.id),
				notes<ListingNotes>().set('lastListingTitle', this.details.title),
				notes<ListingNotes>().set('lastListingStatus', 'draft'),
			);
		}

		console.log(`[DOMAIN] Created listing: ${this.details.title}`);
	}

	private validateDetails(): void {
		if (!this.details.title) {
			throw new Error('Validation error: title is required');
		}
		if (this.details.title.length < 5) {
			throw new Error('Validation error: Title must be at least 5 characters');
		}
		if (this.details.title.length > 100) {
			throw new Error('Validation error: Title must be at most 100 characters');
		}
		if (!this.details.description) {
			throw new Error('Validation error: description is required');
		}
		if (!this.details.category) {
			throw new Error('Validation error: category is required');
		}
		if (!this.details.location) {
			throw new Error('Validation error: location is required');
		}
	}

	toString = () => `creates listing "${this.details.title}" (domain)`;
}
