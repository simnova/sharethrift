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

		// Validate the response contains expected data
		if (!listing.id) {
			throw new Error('Session listing:create returned a listing without an id');
		}
		if (listing.title !== this.details.title) {
			throw new Error(
				`Session listing:create returned title "${listing.title}", expected "${this.details.title}"`,
			);
		}

		const expectedState = isDraft ? 'draft' : 'active';
		if (this.normalizeStatus(listing.state) !== expectedState) {
			throw new Error(
				`Session listing:create returned state "${listing.state}", expected a normalized state of "${expectedState}"`,
			);
		}

		// Re-query to verify persistence
		const persisted = await session.execute<{ id: string }, ItemListingResponse | null>('listing:getById', {
			id: listing.id,
		});
		if (!persisted) {
			throw new Error(
				`Listing ${listing.id} was not found on re-query — session backend did not persist the listing`,
			);
		}
		if (persisted.title !== this.details.title) {
			throw new Error(
				`Re-queried listing title "${persisted.title}" does not match created title "${this.details.title}"`,
			);
		}

		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listing.id),
			notes<ListingNotes>().set('lastListingTitle', listing.title),
			notes<ListingNotes>().set('lastListingStatus', this.normalizeStatus(listing.state)),
		);

	}

	private calculateStartDate(): Date {
		return new Date(Date.now() + ONE_DAY_MS);
	}

	private calculateEndDate(): Date {
		return new Date(Date.now() + ONE_DAY_MS * DEFAULT_SHARING_PERIOD_DAYS);
	}

	private normalizeStatus(status: ItemListingResponse['state']): string {
		const normalized = status.toLowerCase();
		return normalized === 'published' ? 'active' : normalized;
	}

	override toString = () => `creates listing "${this.details.title}" (session)`;
}
