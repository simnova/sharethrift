import { Task, type Actor, notes } from '@serenity-js/core';
import { ExecuteMutation } from '../../interactions/graphql/ExecuteMutation.js';
import apolloClient from '@apollo/client';
const { gql } = apolloClient;

interface ListingNotes {
	lastListingId: string;
	lastListingStatus: string;
}

const ACTIVATE_LISTING_MUTATION = gql`
	mutation ActivateItemListing($id: ID!) {
		activateItemListing(id: $id) {
			success
			listing {
				id
				state
			}
		}
	}
`;

/**
 * PublishListing task for GRAPHQL level.
 *
 * Activates a listing via the GraphQL API.
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

		console.log(`[GRAPHQL] Publishing listing: ${id}`);

		// Execute mutation
		const result: any = await actor.attemptsTo(
			ExecuteMutation.called('activateItemListing').with(ACTIVATE_LISTING_MUTATION, { id }),
		);

		// Update state in notes
		if (result.activateItemListing.success) {
			await actor.attemptsTo(
				notes<ListingNotes>().set('lastListingStatus', result.activateItemListing.listing.state),
			);
		}
	}

	toString = () => `publishes listing ${this.listingId || '(just created)'} (GraphQL)`;
}
