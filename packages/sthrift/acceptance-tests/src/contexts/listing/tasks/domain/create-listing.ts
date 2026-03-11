import { Task, type Actor, notes } from '@serenity-js/core';
import { CreateListingAbility } from '../../abilities/create-listing-ability.ts';
import type { ListingDetails } from '../../abilities/listing-types.ts';

interface ListingNotes {
	lastListingId: string;
	lastListingTitle: string;
	lastListingStatus: string;
}

export type { ListingDetails };

export interface CreateListingInput {
	title: string;
	description: string;
	category: string;
	location: string;
	state?: string;
	isDraft?: boolean | string;
}
export class CreateListing extends Task {
	static with(details: CreateListingInput) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: CreateListingInput) {
		super(`creates listing "${details.title}" (domain)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const ability = CreateListingAbility.as(actor);
		// Convert isDraft from feature file to state parameter (isDraft: false = Active)
		const state = this.details.isDraft === 'false' || this.details.isDraft === false ? 'Active' : 'Draft';
		ability.createDraftListing({
			title: this.details.title,
			description: this.details.description,
			category: this.details.category,
			location: this.details.location,
			state,
		});

		const listing = ability.getCreatedListing();
		if (listing) {
			const state = String(listing['state'] ?? 'draft').toLowerCase();
			await actor.attemptsTo(
				notes<ListingNotes>().set('lastListingId', listing.id),
				notes<ListingNotes>().set('lastListingTitle', this.details.title),
				notes<ListingNotes>().set('lastListingStatus', state),
			);
		}
	}

	override toString = () => `creates listing "${this.details.title}" (domain)`;
}
