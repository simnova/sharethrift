import { Task, type Actor, notes } from '@serenity-js/core';
import { CreateListingAbility } from '../../abilities/create-listing-ability.js';
import type { ListingDetails } from '../../abilities/listing-session.js';

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
		ability.createDraftListing(this.details);

		const listing = ability.getCreatedListing();
		if (listing) {
			await actor.attemptsTo(
				notes<ListingNotes>().set('lastListingId', listing.id),
				notes<ListingNotes>().set('lastListingTitle', this.details.title),
				notes<ListingNotes>().set('lastListingStatus', 'draft'),
			);
		}
	}

	override toString = () => `creates listing "${this.details.title}" (domain)`;
}
