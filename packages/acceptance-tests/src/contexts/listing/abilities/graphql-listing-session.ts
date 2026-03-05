import { GraphqlSession } from '../../../shared/abilities/graphql-session.js';
import type { CreateItemListingInput, ItemListing } from './listing-session.js';

/**
 * GraphQLListingSession - Listing-specific implementation of GraphQL operations.
 *
 * Extends generic GraphqlSession with listing-specific GraphQL queries/mutations.
 * Registers operation handlers in constructor and provides convenience methods.
 */
export class GraphQLListingSession extends GraphqlSession {
	context = 'listing';

	constructor(apiUrl: string) {
		super(apiUrl);
		// Register listing operations with the parent Session
		this.registerOperation('listing:create', (input) =>
			this.handleCreateListing(input as unknown as CreateItemListingInput),
		);
		this.registerOperation('listing:getById', (input) =>
			this.handleGetListingById(input as unknown as { id: string }),
		);
	}

	/**
	 * Convenience method: Create a listing
	 * (delegates to registered operation for backward compatibility)
	 */
	createItemListing(input: CreateItemListingInput): Promise<ItemListing> {
		return this.execute<CreateItemListingInput, ItemListing>('listing:create', input);
	}

	/**
	 * Convenience method: Get listing by ID
	 * (delegates to registered operation for backward compatibility)
	 */
	getListingById(id: string): Promise<ItemListing | null> {
		return this.execute<{ id: string }, ItemListing | null>('listing:getById', { id });
	}

	/**
	 * Handle creating a listing via GraphQL
	 */
	private async handleCreateListing(input: CreateItemListingInput): Promise<ItemListing> {
		const mutation = `
			mutation CreateItemListing($input: CreateItemListingInput!) {
				createItemListing(input: $input) {
					id
					title
					description
					category
					location
					state
					sharingPeriodStart
					sharingPeriodEnd
					images
				}
			}
		`;

		const response = await this.executeGraphQL(mutation, {
			input: this.serializeInput(input),
		});
		const createItemListingData = response.data['createItemListing'] as Record<string, unknown>;
		return this.deserializeItemListing(createItemListingData);
	}

	/**
	 * Handle getting a listing by ID via GraphQL
	 */
	private async handleGetListingById(input: { id: string }): Promise<ItemListing | null> {
		const query = `
			query GetListing($id: ID!) {
				itemListing(id: $id) {
					id
					title
					description
					category
					location
					state
					sharingPeriodStart
					sharingPeriodEnd
					images
				}
			}
		`;

		const response = await this.executeGraphQL(query, { id: input.id });
		const itemListingData = response.data['itemListing'] as Record<string, unknown> | undefined;
		return itemListingData ? this.deserializeItemListing(itemListingData) : null;
	}

	/**
	 * Serialize input for GraphQL (Date -> ISO 8601 DateTime string)
	 */
	private serializeInput(input: CreateItemListingInput): Record<string, unknown> {
		return {
			...input,
			sharingPeriodStart: input.sharingPeriodStart.toISOString(),
			sharingPeriodEnd: input.sharingPeriodEnd.toISOString(),
		};
	}

	/**
	 * Deserialize GraphQL response (ISO string -> Date)
	 */
	private deserializeItemListing(data: Record<string, unknown>): ItemListing {
		const item = data as unknown as ItemListing;
		return {
			id: String(item.id),
			title: String(item.title),
			description: String(item.description),
			category: String(item.category),
			location: String(item.location),
			state: String(item.state) as 'draft' | 'published',
			sharingPeriodStart: item.sharingPeriodStart ? new Date(String(item.sharingPeriodStart)) : new Date(),
			sharingPeriodEnd: item.sharingPeriodEnd ? new Date(String(item.sharingPeriodEnd)) : new Date(),
			images: Array.isArray(item.images) ? item.images : [],
		};
	}
}
