import { Task, type Actor, notes } from '@serenity-js/core';
import { getSession } from '../../abilities/session.js';

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

export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`creates listing "${details.title}" (session)`);
	}

	async performAs(actor: Actor): Promise<void> {
		// Get the Session ability (could be DomainSession or GraphqlSession)
		const session = getSession(actor);

		// Create the listing via Session interface
		const listing = await session.createItemListing({
			title: this.details.title,
			description: this.details.description,
			category: this.details.category,
			location: this.details.location,
			sharingPeriodStart: this.calculateStartDate(),
			sharingPeriodEnd: this.calculateEndDate(),
			images: [],
			isDraft: true, // Always create as draft first
		});

		// Store listing details in notes for later tasks
		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listing.id),
			notes<ListingNotes>().set('lastListingTitle', listing.title),
			notes<ListingNotes>().set('lastListingStatus', listing.state),
		);

		console.log(`[SESSION] Created listing: ${listing.title} (${listing.id})`);
	}

	private calculateStartDate(): Date {
		return new Date(Date.now() + 86400000);
	}

	private calculateEndDate(): Date {
		return new Date(Date.now() + 86400000 * 30);
	}

	override toString = () => `creates listing "${this.details.title}" (session)`;
}
