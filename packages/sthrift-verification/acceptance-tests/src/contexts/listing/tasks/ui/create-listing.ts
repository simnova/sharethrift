import '../../../../shared/support/ui/setup-jsdom.ts';
import { type Actor, notes, Task } from '@serenity-js/core';
import { render, cleanup, act } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ListingForm } from '@sthrift/ui-components';
import { CreateListing as CreateListingComponent } from '@apps/ui-sharethrift/src/components/layouts/app/pages/create-listing/components/create-listing.tsx';
import { ListingPage } from '@sthrift-verification/test-support/pages';
import { JsdomPageAdapter } from '@sthrift-verification/test-support/pages/jsdom';
import { CreateListingAbility } from '../../abilities/create-listing-ability.ts';
import type {
	ListingDetails,
	ListingNotes,
} from '../../abilities/listing-types.ts';
import { cleanupJsdom } from '../../../../shared/support/ui/jsdom-setup.ts';

const noop = () => undefined;

export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`fills and submits create listing form "${details.title}"`);
	}

	async performAs(actor: Actor): Promise<void> {
		const isDraft = !(
			this.details.isDraft === 'false' || this.details.isDraft === false
		);
		const state = isDraft ? 'draft' : 'active';

		// 1. Render and interact with UI via page object
		await this.interactWithUI(isDraft);

		// 2. Domain validation (source of truth for test assertions)
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

		// 3. Store values in notes for assertion steps
		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listing.id),
			notes<ListingNotes>().set('lastListingTitle', listing.title),
			notes<ListingNotes>().set('lastListingStatus', state),
		);
	}

	private async interactWithUI(isDraft: boolean): Promise<void> {
		globalThis.React = React;

		try {
			// Render the full CreateListing page component
			const { container } = render(
				React.createElement(
					MemoryRouter,
					null,
					React.createElement(
						CreateListingComponent as React.ComponentType<
							Record<string, unknown>
						>,
						{
							categories: [
								...new Set([
									this.details.category ?? 'Other',
									'Electronics',
									'Sports',
								]),
							],
							isLoading: false,
							submissionStatus: 'idle' as const,
							onSubmit: noop,
							onCancel: noop,
							uploadedImages: [],
							onImageAdd: noop,
							onImageRemove: noop,
							onViewListing: noop,
							onViewDraft: noop,
							onModalClose: noop,
						},
					),
				),
			);

			// Use shared page object for form interactions
			const page = new ListingPage(new JsdomPageAdapter(container));

			await act(async () => {
				await page.fillForm({
					title: this.details.title,
					description: this.details.description,
					location: this.details.location,
					category: this.details.category,
				});
			});

			await act(async () => {
				if (isDraft) {
					await page.clickSaveDraft();
				} else {
					await page.clickPublish();
				}
			});

			// Also render the shared ListingForm standalone for ui-components coverage
			render(
				React.createElement(
					ListingForm as React.ComponentType<Record<string, unknown>>,
					{
						categories: [
							...new Set([this.details.category ?? 'Other', 'Electronics']),
						],
						isLoading: false,
						maxCharacters: 2000,
						handleFormSubmit: noop,
						onCancel: noop,
					},
				),
			);

			cleanup();
		} finally {
			cleanupJsdom();
		}
	}

	override toString = () =>
		`fills and submits create listing form "${this.details.title}"`;
}
