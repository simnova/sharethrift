import { Task, type Actor, notes } from '@serenity-js/core';
import { CreateListingAbility } from '../../abilities/create-listing-ability.js';

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
export interface CreateListingInput {
	title: string;
	description: string;
	category: string;
	location: string;
}
export class CreateListing extends Task {
	static with(details: CreateListingInput) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: CreateListingInput) {
		super(`creates listing "${details.title}" (domain)`);
	}

	async performAs(actor: Actor): Promise<void> {
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

	override toString = () => `creates listing "${this.details.title}" (domain)`;
}
