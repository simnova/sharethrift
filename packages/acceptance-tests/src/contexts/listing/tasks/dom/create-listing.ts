import { Task, type Actor, notes } from '@serenity-js/core';
import { ListingForm, type ListingFormProps } from '@sthrift/ui-components';
import { RenderComponents } from '../../../../shared/abilities/render-components.js';
import { getSession } from '../../../../shared/abilities/session.js';

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
		super(`creates listing "${details.title}" (dom)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const renderer = RenderComponents.as(actor);
		const session = getSession(actor, 'listing');

		// Track form submission
		let submitCalled = false;
		let submitIsDraft = false;

		const formProps: ListingFormProps = {
			categories: [
				'Electronics',
				'Books',
				'Home & Garden',
				'Sports & Recreation',
				'Tools',
				'Clothing',
				'Other',
			],
			isLoading: false,
			maxCharacters: 2000,
			handleFormSubmit: (isDraft: boolean) => {
				submitCalled = true;
				submitIsDraft = isDraft;
			},
			onCancel: () => {
				// Test handler - no-op
			},
		};

		// 1. Render the actual ListingForm component
		const { getByPlaceholderText, getByRole, user } = renderer.render(
			ListingForm,
			formProps as unknown as Record<string, unknown>,
		);

		// 2. Interact with the form using accessible queries
		if (this.details.title) {
			await user.type(
				getByPlaceholderText('Enter listing title'),
				this.details.title,
			);
		}

		if (this.details.description) {
			await user.type(
				getByPlaceholderText('Describe your item and sharing terms'),
				this.details.description,
			);
		}

		if (this.details.location) {
			await user.type(
				getByPlaceholderText('Enter location'),
				this.details.location,
			);
		}

		// 3. Click "Save as Draft" to trigger form submission
		await user.click(getByRole('button', { name: /save as draft/i }));

		if (!submitCalled) {
			throw new Error('ListingForm handleFormSubmit was not called');
		}

		// 4. Use Session to create the listing (screenplay.js: DOM tasks use Session)
		const listing = await session.execute<unknown, unknown>('listing:create', {
			title: this.details.title,
			description: this.details.description,
			category: this.details.category,
			location: this.details.location,
			sharingPeriodStart: new Date(Date.now() + 86400000),
			sharingPeriodEnd: new Date(Date.now() + 86400000 * 30),
			images: [],
			isDraft: submitIsDraft,
		});

		// 5. Store results for Then steps
		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listing.id),
			notes<ListingNotes>().set('lastListingTitle', listing.title),
			notes<ListingNotes>().set('lastListingStatus', listing.state),
		);
	}

	override toString = () => `creates listing "${this.details.title}" (dom)`;
}
