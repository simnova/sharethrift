import { Task, type Actor, notes } from '@serenity-js/core';
import { CreateListingAbility } from '../../abilities/create-listing-ability.ts';
import type { ListingDetails, ListingNotes } from '../../abilities/listing-types.ts';

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
		// isDraft false → Active, true → Draft
		const state = this.details.isDraft === 'false' || this.details.isDraft === false ? 'Active' : 'Draft';
		ability.createDraftListing({
			title: this.details.title,
			description: this.details.description,
			category: this.details.category,
			location: this.details.location,
			state,
		});

		const listing = ability.getCreatedListing();
		if (!listing) {
			throw new Error('Domain CreateListingAbility.createDraftListing did not produce a listing');
		}
		if (!listing.id) {
			throw new Error('Domain CreateListingAbility produced a listing without an id');
		}
		if (listing.title !== this.details.title) {
			throw new Error(
				`Domain listing title "${listing.title}" does not match input "${this.details.title}"`,
			);
		}
		if (!listing.state) {
			throw new Error('Domain CreateListingAbility produced a listing without a state');
		}
		if (listing.state !== state) {
			throw new Error(
				`Domain listing state "${listing.state}" does not match expected "${state}"`,
			);
		}

		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listing.id),
			notes<ListingNotes>().set('lastListingTitle', listing.title),
			notes<ListingNotes>().set('lastListingStatus', listing.state.toLowerCase()),
		);
	}

	override toString = () => `creates listing "${this.details.title}" (domain)`;
}
