import { GraphqlSession } from '../../../shared/abilities/graphql-session.js';
import type { CreateItemListingInput, ItemListingResponse } from './listing-session.js';

export class GraphQLListingSession extends GraphqlSession {
	context = 'listing';

	constructor(apiUrl: string) {
		super(apiUrl);
		this.registerOperation('listing:create', (input) =>
			this.handleCreateListing(input as unknown as CreateItemListingInput),
		);
		this.registerOperation('listing:getById', (input) =>
			this.handleGetListingById(input as unknown as { id: string }),
		);
	}

	createItemListing(input: CreateItemListingInput): Promise<ItemListingResponse> {
		return this.execute<CreateItemListingInput, ItemListingResponse>('listing:create', input);
	}

	getListingById(id: string): Promise<ItemListingResponse | null> {
		return this.execute<{ id: string }, ItemListingResponse | null>('listing:getById', { id });
	}

	private async handleCreateListing(input: CreateItemListingInput): Promise<ItemListingResponse> {
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

	private async handleGetListingById(input: { id: string }): Promise<ItemListingResponse | null> {
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

	private serializeInput(input: CreateItemListingInput): Record<string, unknown> {
		return {
			...input,
			sharingPeriodStart: input.sharingPeriodStart.toISOString(),
			sharingPeriodEnd: input.sharingPeriodEnd.toISOString(),
		};
	}

	private deserializeItemListing(data: Record<string, unknown>): ItemListingResponse {
		const item = data as unknown as ItemListingResponse;
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
