import { Task, type Actor, notes } from '@serenity-js/core';
import { ExecuteMutation } from '../../interactions/graphql/ExecuteMutation.js';
import gql from 'graphql-tag';

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

const CREATE_ITEM_LISTING_MUTATION = gql`
	mutation CreateItemListing($input: CreateItemListingInput!) {
		createItemListing(input: $input) {
			id
			title
			description
			category
			location
			state
		}
	}
`;

/**
 * CreateListing task for GRAPHQL level.
 *
 * Uses mocked GraphQL responses to test query/mutation structure
 * without requiring real servers or infrastructure.
 */
export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`creates listing "${details.title}" (GraphQL)`);
	}

	async performAs(actor: Actor): Promise<void> {
		// Make GraphQL call via mocked ExecuteMutation
		const response = await actor.answer(
			ExecuteMutation.called('createItemListing').with(
				CREATE_ITEM_LISTING_MUTATION,
				{
					input: {
						title: this.details.title,
						description: this.details.description,
						category: this.details.category,
						location: this.details.location,
						sharingPeriodStart: this.calculateStartDate(),
						sharingPeriodEnd: this.calculateEndDate(),
					},
				},
			),
		);

		// Extract the created listing from mocked response
		if (!response?.createItemListing) {
			throw new Error('Mock response did not contain createItemListing');
		}
		const listing = response.createItemListing;

		// Store the listing ID and state for later tasks
		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listing.id),
			notes<ListingNotes>().set('lastListingTitle', listing.title),
			notes<ListingNotes>().set('lastListingStatus', listing.state),
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

	toString = () => `creates listing "${this.details.title}" (GraphQL mocked)`;
}
