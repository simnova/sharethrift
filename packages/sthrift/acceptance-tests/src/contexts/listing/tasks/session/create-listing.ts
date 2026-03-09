import { Task, type Actor, notes } from '@serenity-js/core';
import { getSession } from '../../../../shared/abilities/session.js';
import { ONE_DAY_MS, DEFAULT_SHARING_PERIOD_DAYS } from '../../../../shared/support/domain-test-helpers.js';
import type { ListingDetails } from '../../abilities/listing-session.js';

interface ListingNotes {
	lastListingId: string;
	lastListingTitle: string;
	lastListingStatus: string;
}

export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`creates listing "${details.title}" (session)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const session = getSession(actor, 'listing');

		const listing = await session.execute<unknown, Record<string, unknown>>('listing:create', {
			title: this.details.title,
			description: this.details.description,
			category: this.details.category,
			location: this.details.location,
			sharingPeriodStart: this.calculateStartDate(),
			sharingPeriodEnd: this.calculateEndDate(),
			images: [],
			isDraft: true,
		});

		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', String(listing['id'])),
			notes<ListingNotes>().set('lastListingTitle', String(listing['title'])),
			notes<ListingNotes>().set('lastListingStatus', String(listing['state']).toLowerCase()),
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
