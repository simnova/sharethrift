import { Task, type Actor, notes } from '@serenity-js/core';
import { ExecuteMutation } from '../../interactions/graphql/ExecuteMutation.js';
import gql from 'graphql-tag';

interface ListingNotes {
	lastListingId: string;
	lastListingStatus: string;
}

const ACTIVATE_LISTING_MUTATION = gql`
	mutation ActivateListing($input: ActivateListingInput!) {
		activateListing(input: $input) {
			id
			state
		}
	}
`;

/**
 * PublishListing task for GRAPHQL level.
 *
 * Uses mocked GraphQL responses to test query/mutation structure
 * without requiring real servers or infrastructure.
 */
export class PublishListing extends Task {
	static justCreated() {
		return new PublishListing(undefined);
	}

	static withId(id: string) {
		return new PublishListing(id);
	}

	private constructor(private readonly listingId?: string) {
		super(
			listingId
				? `publishes listing ${listingId} (GraphQL)`
				: 'publishes just created listing (GraphQL)',
		);
	}

	async performAs(actor: Actor): Promise<void> {
		// Get listing ID from notes if not provided
		const id = this.listingId || await actor.answer(notes<ListingNotes>().get('lastListingId'));

		if (!id) {
			throw new Error('No listing ID available to publish');
		}

		// Make GraphQL call via mocked ExecuteMutation
		const response = await actor.answer(
			ExecuteMutation.called('activateListing').with(
				ACTIVATE_LISTING_MUTATION,
				{
					input: {
						id,
					},
				},
			),
		);

		// Extract the updated listing from mocked response
		if (!response?.activateListing) {
			throw new Error('Mock response did not contain activateListing');
		}
		const listing = response.activateListing;

		// Update state in notes
		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingStatus', listing.state),
		);
	}

	toString = () => `publishes listing ${this.listingId || '(just created)'} (GraphQL mocked)`;
}
