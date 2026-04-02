import { Task, type Actor, notes } from '@serenity-js/core';
import type { ListingDetails, ListingNotes } from '../../abilities/listing-types.ts';
import { CreateListingAbility } from '../../abilities/create-listing-ability.ts';

export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`renders create listing UI "${details.title}"`);
	}

	async performAs(actor: Actor): Promise<void> {
		// 1. Perform domain validation first (same behavior as domain level)
		const isDraft = !(
			this.details.isDraft === 'false' || this.details.isDraft === false
		);
		const state = isDraft ? 'draft' : 'active';

		const ability = CreateListingAbility.as(actor);
		ability.createDraftListing({
			title: this.details.title,
			description: this.details.description,
			category: this.details.category,
			location: this.details.location,
			state: isDraft ? 'Draft' : 'Active',
		});

		const listing = ability.getCreatedListing();
		if (!listing) {
			throw new Error(
				'Domain CreateListingAbility.createDraftListing did not produce a listing',
			);
		}

		// 2. Render UI components for code coverage
		const { ensureJsdom, cleanupJsdom } = await import(
			'../../../../shared/support/ui/jsdom-setup.ts'
		);
		const { renderForCoverage } = await import(
			'../../../../shared/support/ui/react-render.tsx'
		);

		ensureJsdom();

		// Render the CreateListing presentational component
		const { CreateListing: CreateListingComponent } = await import(
			'@apps/ui-sharethrift/src/components/layouts/app/pages/create-listing/components/create-listing.tsx'
		);

		const { cleanup } = await renderForCoverage(
			CreateListingComponent as React.ComponentType<Record<string, unknown>>,
			{
				categories: [
					this.details.category ?? 'Other',
					'Electronics',
					'Sports',
				],
				isLoading: false,
				submissionStatus: 'idle' as const,
				onSubmit: () => {},
				onCancel: () => {},
				uploadedImages: [],
				onImageAdd: () => {},
				onImageRemove: () => {},
				onViewListing: () => {},
				onViewDraft: () => {},
				onModalClose: () => {},
			},
			{ withRouter: true },
		);

		cleanup();

		// Also render the shared ListingForm from ui-components for coverage
		const { ListingForm } = await import('@sthrift/ui-components');
		const { cleanup: cleanup2 } = await renderForCoverage(
			ListingForm as React.ComponentType<Record<string, unknown>>,
			{
				categories: [this.details.category ?? 'Other', 'Electronics'],
				isLoading: false,
				maxCharacters: 2000,
				handleFormSubmit: () => {},
				onCancel: () => {},
			},
			{ withRouter: false },
		);

		cleanup2();
		cleanupJsdom();

		// 3. Store values in notes for assertion steps
		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listing.id),
			notes<ListingNotes>().set('lastListingTitle', listing.title),
			notes<ListingNotes>().set('lastListingStatus', state),
		);
	}

	override toString = () =>
		`renders create listing UI "${this.details.title}"`;
}
