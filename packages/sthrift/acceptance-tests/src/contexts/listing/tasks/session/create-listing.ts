import { Task, type Actor, notes } from '@serenity-js/core';
import { getSession } from '../../../../shared/abilities/session.ts';
import { ONE_DAY_MS, DEFAULT_SHARING_PERIOD_DAYS } from '../../../../shared/support/domain-test-helpers.ts';
import type { ListingDetails, ListingNotes, CreateItemListingInput, ItemListingResponse } from '../../abilities/listing-types.ts';

export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`creates listing "${details.title}" (session)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const session = getSession(actor, 'listing');

		// isDraft false → draft false (Active)
		const isDraft = !(this.details.isDraft === 'false' || this.details.isDraft === false);

		const listing = await session.execute<CreateItemListingInput, ItemListingResponse>('listing:create', {
			title: this.details.title,
			description: this.details.description,
			category: this.details.category,
			location: this.details.location,
			sharingPeriodStart: this.calculateStartDate(),
			sharingPeriodEnd: this.calculateEndDate(),
			images: [],
			isDraft,
		});

		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listing.id),
			notes<ListingNotes>().set('lastListingTitle', listing.title),
			notes<ListingNotes>().set('lastListingStatus', listing.state.toLowerCase()),
		);

	}

	private calculateStartDate(): Date {
		return new Date(Date.now() + ONE_DAY_MS);
	}

	private calculateEndDate(): Date {
		return new Date(Date.now() + ONE_DAY_MS * DEFAULT_SHARING_PERIOD_DAYS);
	}

	override toString = () => `creates listing "${this.details.title}" (session)`;
}
