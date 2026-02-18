import { Interaction, type Actor } from '@serenity-js/core';
import { Enter, Click, Wait, isVisible } from '@serenity-js/web';
import { CreateListingPage } from '../../ui/CreateListingPage.js';

export interface ListingFormData {
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart?: string;
	sharingPeriodEnd?: string;
}

/**
 * Interaction for filling out the listing creation form.
 * 
 * Following Serenity/JS best practices:
 * - Interactions are low-level, reusable UI actions
 * - They use Page Objects for element location
 * - They don't contain business logic
 */
export class FillListingForm extends Interaction {
	static with(formData: ListingFormData): FillListingForm {
		return new FillListingForm(formData);
	}

	private constructor(private readonly formData: ListingFormData) {
		super(`#actor fills the listing form with "${formData.title}"`);
	}

	async performAs(actor: Actor): Promise<void> {
		const startDate = this.formData.sharingPeriodStart || this.calculateStartDate();
		const endDate = this.formData.sharingPeriodEnd || this.calculateEndDate();

		await actor.attemptsTo(
			Enter.theValue(this.formData.title).into(CreateListingPage.titleInput),
			Enter.theValue(this.formData.description).into(CreateListingPage.descriptionTextarea),
			Enter.theValue(this.formData.category).into(CreateListingPage.categorySelect),
			Enter.theValue(this.formData.location).into(CreateListingPage.locationInput),
			Enter.theValue(startDate).into(CreateListingPage.sharingPeriodStartInput),
			Enter.theValue(endDate).into(CreateListingPage.sharingPeriodEndInput),
		);
	}

	private calculateStartDate(): string {
		const tomorrow = new Date(Date.now() + 86400000);
		return tomorrow.toISOString().split('T')[0];
	}

	private calculateEndDate(): string {
		const endDate = new Date(Date.now() + 86400000 * 30);
		return endDate.toISOString().split('T')[0];
	}
}

/**
 * Interaction for submitting the listing form as draft.
 */
export class SubmitListingAsDraft extends Interaction {
	static andWaitForConfirmation(): SubmitListingAsDraft {
		return new SubmitListingAsDraft(true);
	}

	static withoutWaiting(): SubmitListingAsDraft {
		return new SubmitListingAsDraft(false);
	}

	private constructor(private readonly waitForConfirmation: boolean) {
		super('#actor submits the listing form');
	}

	async performAs(actor: Actor): Promise<void> {
		await actor.attemptsTo(Click.on(CreateListingPage.saveDraftButton));

		if (this.waitForConfirmation) {
			await actor.attemptsTo(Wait.until(CreateListingPage.successMessage, isVisible()));
		}
	}
}
