import { Task, type Actor, notes } from '@serenity-js/core';
import { ListingForm, type ListingFormProps } from '@sthrift/ui-components';
import { RenderComponents } from '../../../../shared/abilities/render-components.js';
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
		super(`creates listing "${details.title}" (dom)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const renderer = RenderComponents.as(actor);
		const session = getSession(actor, 'listing');

		renderer.cleanupDOM();

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
				/* no-op */
			},
		};

		const { getByPlaceholderText, getByRole, user } = renderer.render(
			ListingForm,
			formProps as unknown as Record<string, unknown>,
		);

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

		await user.click(getByRole('button', { name: /save as draft/i }));

		if (!submitCalled) {
			throw new Error('ListingForm handleFormSubmit was not called');
		}

		const listing = await session.execute<unknown, Record<string, unknown>>('listing:create', {
			title: this.details.title,
			description: this.details.description,
			category: this.details.category,
			location: this.details.location,
			sharingPeriodStart: new Date(Date.now() + ONE_DAY_MS),
			sharingPeriodEnd: new Date(Date.now() + ONE_DAY_MS * DEFAULT_SHARING_PERIOD_DAYS),
			images: [],
			isDraft: submitIsDraft,
		});

		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', String(listing['id'])),
			notes<ListingNotes>().set('lastListingTitle', String(listing['title'])),
			notes<ListingNotes>().set('lastListingStatus', String(listing['state']).toLowerCase()),
		);
	}

	override toString = () => `creates listing "${this.details.title}" (dom)`;
}
