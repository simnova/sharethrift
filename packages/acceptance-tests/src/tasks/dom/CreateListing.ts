import { Task, type Actor, notes } from '@serenity-js/core';
import { Navigate } from '@serenity-js/web';
import { CreateListingPage } from '../../ui/CreateListingPage.js';
import { FillListingForm, SubmitListingAsDraft } from '../../interactions/dom/FillListingForm.js';

interface ListingNotes {
	lastListingId?: string;
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
 * CreateListing task at the DOM level.
 *
 * Following Aslak Hellesøy's Screenplay Pattern:
 * - Tasks = WHAT the user does (business intent)
 * - Interactions = HOW to do it (UI mechanics)
 * - Page Objects = WHERE to find elements
 * 
 * This is a HIGH-LEVEL task that composes interactions.
 * It focuses on the user's goal, not UI implementation details.
 * 
 * Requirements:
 * - UI application must be running (e.g., https://localhost:3000)
 * - Backend can be real or mocked (transparent to this task)
 */
export class CreateListing extends Task {
	static with(details: ListingDetails): CreateListing {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`#actor creates listing "${details.title}" via UI`);
	}

	async performAs(actor: Actor): Promise<void> {
		// Navigate to create listing page
		await actor.attemptsTo(Navigate.to(CreateListingPage.url));

		// Fill the form (using reusable interaction)
		await actor.attemptsTo(
			FillListingForm.with({
				title: this.details.title,
				description: this.details.description,
				category: this.details.category,
				location: this.details.location,
			}),
		);

		// Submit as draft
		await actor.attemptsTo(SubmitListingAsDraft.andWaitForConfirmation());

		// Store result in notes for assertions
		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingTitle', this.details.title),
			notes<ListingNotes>().set('lastListingStatus', 'draft'),
		);
	}
}
