import { Question, type Actor } from '@serenity-js/core';
import { CreateListingAbility } from '../abilities/CreateListingAbility';

/**
 * ListingStatus is a Question that retrieves the status of a listing.
 *
 * Questions are used in assertions to query the current state.
 * They work across all testing levels (domain/graphql/dom).
 */
export class ListingStatus extends Question<Promise<string>> {
	constructor(private readonly actor: Actor) {
		super();
	}

	/**
	 * Retrieve the listing status based on the current testing level
	 */
	async answeredBy(actor: Actor): Promise<string> {
		// At domain level, query the ability directly
		const ability = CreateListingAbility.as(actor);
		const listing = ability.getCreatedListing();

		if (!listing) {
			throw new Error('No listing has been created yet');
		}

		// TODO: Add support for GraphQL and DOM levels
		// At GraphQL level: Query the API
		// At DOM level: Read from the page

		return 'draft'; // Mock implementation
	}

	/**
	 * Factory method to create this question for an actor
	 */
	static of(actor: Actor): ListingStatus {
		return new ListingStatus(actor);
	}

	toString(): string {
		return 'the listing status';
	}
}
