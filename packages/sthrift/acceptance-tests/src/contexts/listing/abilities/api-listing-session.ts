import { ApiSession } from '../../../shared/abilities/api-session.ts';
import type { CreateItemListingInput, ItemListingResponse } from './listing-types.ts';


interface ListingSessionConfig {
	// Include isDraft in serialization (MongoDB only)
	includeIsDraft?: boolean;
}

export abstract class ApiListingSession extends ApiSession {
	context = 'listing';
	protected config: ListingSessionConfig = {};

	constructor(apiUrl: string, authToken?: string) {
		super(apiUrl, authToken);
		this.registerOperations();
	}

	protected registerOperations(): void {
		this.registerOperation('listing:create', (input) =>
			this.handleCreateListing(input as CreateItemListingInput),
		);
		this.registerOperation('listing:getById', (input) =>
			this.handleGetListingById(input as { id: string }),
		);
	}

	createItemListing(input: CreateItemListingInput): Promise<ItemListingResponse> {
		return this.execute<CreateItemListingInput, ItemListingResponse>('listing:create', input);
	}

	getListingById(id: string): Promise<ItemListingResponse | null> {
		return this.execute<{ id: string }, ItemListingResponse | null>('listing:getById', { id });
	}

	protected async handleCreateListing(input: CreateItemListingInput): Promise<ItemListingResponse> {
		const mutation = `
			mutation CreateItemListing($input: ItemListingCreateInput!) {
				createItemListing(input: $input) {
					status {
						success
						errorMessage
					}
					listing {
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
			}
		`;

		const response = await this.executeGraphQL(mutation, {
			input: this.serializeInput(input),
		});
		const mutationResult = response.data['createItemListing'] as Record<string, unknown>;
		const status = mutationResult['status'] as Record<string, unknown> | undefined;

		if (status && !status['success']) {
			throw new Error(String(status['errorMessage'] ?? 'Failed to create listing'));
		}

		const createItemListingData = (mutationResult['listing'] ?? {}) as Record<string, unknown>;
		return this.deserializeItemListing(createItemListingData);
	}

	protected async handleGetListingById(input: { id: string }): Promise<ItemListingResponse | null> {
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

	protected serializeInput(input: CreateItemListingInput): Record<string, unknown> {
		const serialized: Record<string, unknown> = {
			...input,
			sharingPeriodStart: input.sharingPeriodStart.toISOString(),
			sharingPeriodEnd: input.sharingPeriodEnd.toISOString(),
		};

		// MongoDB requires explicit isDraft parameter, GraphQL doesn't
		if (this.config.includeIsDraft) {
			serialized['isDraft'] = input.isDraft ?? true;
		}

		return serialized;
	}

	private toDate(value: unknown): Date {
		if (!value) return new Date();
		const dateStr = typeof value === 'string' ? value : String(value);
		return new Date(dateStr);
	}

	protected deserializeItemListing(data: Record<string, unknown>): ItemListingResponse {
		return {
			id: String(data['id']),
			title: String(data['title']),
			description: String(data['description']),
			category: String(data['category']),
			location: String(data['location']),
			state: String(data['state']) as 'draft' | 'published',
			sharingPeriodStart: this.toDate(data['sharingPeriodStart']),
			sharingPeriodEnd: this.toDate(data['sharingPeriodEnd']),
			images: Array.isArray(data['images']) ? data['images'] : [],
		};
	}
}
