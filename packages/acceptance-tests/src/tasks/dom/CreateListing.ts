import { Task, type Actor, notes } from '@serenity-js/core';
import { Navigate, Click, Enter } from '@serenity-js/web';
import { PageElement, By, isVisible } from '@serenity-js/web';
import { Wait } from '@serenity-js/core';

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
 * Interacts with the UI through browser automation.
 * Slowest execution, tests the complete user journey.
 */
export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`creates listing "${details.title}" (DOM)`);
	}

	async performAs(actor: Actor): Promise<void> {
		// Validate required fields
		this.validateDetails();

		console.log(`[DOM] Creating listing: ${this.details.title}`);

		// Navigate and fill form using Serenity/JS Playwright interactions
		await actor.attemptsTo(
			Navigate.to('http://localhost:3000/create-listing'),

			Enter.theValue(this.details.title).into(
				PageElement.located(By.css('input[name=\"title\"]')).describedAs('title input'),
			),

			Enter.theValue(this.details.description).into(
				PageElement.located(By.css('textarea[name=\"description\"]')).describedAs(
					'description textarea',
				),
			),

			Enter.theValue(this.details.category).into(
				PageElement.located(By.css('select[name=\"category\"]')).describedAs('category select'),
			),

			Enter.theValue(this.details.location).into(
				PageElement.located(By.css('input[name=\"location\"]')).describedAs('location input'),
			),

			// Set sharing period dates
			Enter.theValue(this.calculateStartDate()).into(
				PageElement.located(By.css('input[name=\"sharingPeriodStart\"]')).describedAs('start date'),
			),

			Enter.theValue(this.calculateEndDate()).into(
				PageElement.located(By.css('input[name=\"sharingPeriodEnd\"]')).describedAs('end date'),
			),

			// Click Save as Draft button
			Click.on(
				PageElement.located(By.css('button[data-testid=\"save-draft\"]')).describedAs(
					'save as draft button',
				),
			),

			// Wait for success message
			Wait.until(
				PageElement.located(By.css('.toast-success')).describedAs('success message'),
				isVisible(),
			),
		);

		// Store listing info in notes
		// TODO: Extract listing ID from URL or page
		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingTitle', this.details.title),
			notes<ListingNotes>().set('lastListingStatus', 'draft'),
		);
	}

	private validateDetails(): void {
		if (!this.details.title) {
			throw new Error('Validation error: title is required');
		}
		if (this.details.title.length < 5) {
			throw new Error('Validation error: Title must be at least 5 characters');
		}
		if (this.details.title.length > 100) {
			throw new Error('Validation error: Title must be at most 100 characters');
		}
		if (!this.details.description) {
			throw new Error('Validation error: description is required');
		}
		if (!this.details.category) {
			throw new Error('Validation error: category is required');
		}
		if (!this.details.location) {
			throw new Error('Validation error: location is required');
		}
	}

	private calculateStartDate(): string {
		const tomorrow = new Date(Date.now() + 86400000);
		return tomorrow.toISOString().split('T')[0];
	}

	private calculateEndDate(): string {
		const endDate = new Date(Date.now() + 86400000 * 30);
		return endDate.toISOString().split('T')[0];
	}

	toString = () => `creates listing \"${this.details.title}\" (DOM)`;
}
