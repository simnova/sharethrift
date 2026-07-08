import { type Actor, notes, Task } from '@serenity-js/core';
import { GraphQLClient } from '../../../../shared/abilities/graphql-client.ts';
import { DEFAULT_SHARING_PERIOD_DAYS, ONE_DAY_MS } from '../../../../shared/support/domain-test-helpers.ts';
import type { ItemListingResponse, ListingDetails, ListingNotes } from '../../abilities/listing-types.ts';

const CREATE_LISTING_MUTATION = `
	mutation CreateItemListing($input: ItemListingCreateInput!) {
		createItemListing(input: $input) {
			status { success errorMessage }
			listing {
				id title description category location state
				sharingPeriodStart sharingPeriodEnd images
			}
		}
	}
`;

const GET_LISTING_QUERY = `
	query GetListing($id: ObjectID!) {
		itemListing(id: $id) {
			id title description category location state
			sharingPeriodStart sharingPeriodEnd images
		}
	}
`;

export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`creates listing "${details.title}" (api)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const graphql = actor.abilityTo(GraphQLClient);

		const isDraft = !(this.details.isDraft === 'false' || this.details.isDraft === false);

		const response = await graphql.execute(CREATE_LISTING_MUTATION, {
			input: {
				title: this.details.title,
				description: this.details.description,
				category: this.details.category,
				location: this.details.location,
				sharingPeriodStart: this.calculateStartDate().toISOString(),
				sharingPeriodEnd: this.calculateEndDate().toISOString(),
				images: [],
				isDraft,
			},
		});

		const mutationResult = response.data.createItemListing as Record<string, unknown>;
		const status = mutationResult.status as Record<string, unknown> | undefined;

		if (status && !status.success) {
			throw new Error(String(status.errorMessage ?? 'Failed to create listing'));
		}

		const listing = this.deserializeListing((mutationResult.listing ?? {}) as Record<string, unknown>);

		if (!listing.id) {
			throw new Error('API listing:create returned a listing without an id');
		}
		if (listing.title !== this.details.title) {
			throw new Error(`API listing:create returned title "${listing.title}", expected "${this.details.title}"`);
		}

		const expectedState = isDraft ? 'draft' : 'active';
		if (this.normalizeStatus(listing.state) !== expectedState) {
			throw new Error(`API listing:create returned state "${listing.state}", expected a normalized state of "${expectedState}"`);
		}

		// Re-query to verify persistence
		const persistedResponse = await graphql.execute(GET_LISTING_QUERY, {
			id: listing.id,
		});
		const persistedData = persistedResponse.data.itemListing as Record<string, unknown> | undefined;
		if (!persistedData) {
			throw new Error(`Listing ${listing.id} was not found on re-query — API backend did not persist the listing`);
		}
		const persisted = this.deserializeListing(persistedData);
		if (persisted.title !== this.details.title) {
			throw new Error(`Re-queried listing title "${persisted.title}" does not match created title "${this.details.title}"`);
		}

		await actor.attemptsTo(notes<ListingNotes>().set('lastListingId', listing.id), notes<ListingNotes>().set('lastListingTitle', listing.title), notes<ListingNotes>().set('lastListingStatus', this.normalizeStatus(listing.state)));
	}

	private calculateStartDate(): Date {
		return new Date(Date.now() + ONE_DAY_MS);
	}

	private calculateEndDate(): Date {
		return new Date(Date.now() + ONE_DAY_MS * DEFAULT_SHARING_PERIOD_DAYS);
	}

	private normalizeStatus(status: string): string {
		const normalized = status.toLowerCase();
		return normalized === 'published' ? 'active' : normalized;
	}

	private deserializeListing(data: Record<string, unknown>): ItemListingResponse {
		return {
			id: String(data.id),
			title: String(data.title),
			description: String(data.description),
			category: String(data.category),
			location: String(data.location),
			state: String(data.state) as ItemListingResponse['state'],
			sharingPeriodStart: new Date(String(data.sharingPeriodStart)),
			sharingPeriodEnd: new Date(String(data.sharingPeriodEnd)),
			images: Array.isArray(data.images) ? data.images : [],
		};
	}

	override toString = () => `creates listing "${this.details.title}" (api)`;
}
