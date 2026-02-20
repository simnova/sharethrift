import { Task, type Actor, notes } from '@serenity-js/core';
import { getSession } from '../../abilities/Session.js';

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
 * CreateListing task for SESSION level.
 *
 * Following Screenplay.js design recommendations:
 * "session tasks use a Session interface"
 *
 * This task uses the Session abstraction, which can be either:
 * - DomainSession (direct domain calls, no network) - fast tests
 * - GraphQLSession (real GraphQL HTTP calls) - full integration tests
 *
 * The Session implementation is configured via world parameters.
 * This allows the same task to run with different assemblies:
 * - session tasks + DomainSession = fastest tests (domain layer coverage)
 * - session tasks + GraphQLSession = slower tests (graphql + domain layer coverage)
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`creates listing "${details.title}" (session)`);
	}

	async performAs(actor: Actor): Promise<void> {
		// Get the Session ability (could be DomainSession or GraphQLSession)
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
		const tomorrow = new Date(Date.now() + 86400000);
		return tomorrow;
	}

	private calculateEndDate(): Date {
		const endDate = new Date(Date.now() + 86400000 * 30);
		return endDate;
	}

	toString = () => `creates listing "${this.details.title}" (session)`;
}
