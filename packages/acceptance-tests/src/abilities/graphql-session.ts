import { Ability } from '@serenity-js/core';
import type { CreateItemListingInput, ItemListing, Session } from './session.js';

/**
 * GraphqlSession - makes real GraphQL calls to the GraphQL API.
 *
 * Following Screenplay.js design recommendations:
 * "The GraphqlSession is where you encapsulate all of the fetch, WebSocket and EventSource logic.
 *  This is the class your UI will use in production. You will also use it in tests."
 *
 * Benefits:
 * - Tests full GraphQL + Domain layer coverage
 * - Same code that production UI uses
 * - Catches integration issues
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export class GraphqlSession extends Ability implements Session {
	constructor(private readonly apiUrl: string) {
		super();
	}

	/**
	 * Factory method following Serenity/JS Ability pattern
	 */
	static at(apiUrl: string): GraphqlSession {
		return new GraphqlSession(apiUrl);
	}

	/**
	* Create a listing via GraphQL call
	 */
	async createItemListing(input: CreateItemListingInput): Promise<ItemListing> {
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

			const response = await this.executeGraphQL(mutation, { input: this.serializeInput(input) });
		const createItemListingData = response.data['createItemListing'] as Record<string, unknown>;
		return this.deserializeItemListing(createItemListingData);
	}

	/**
	* Get listing by ID via GraphQL call
	 */
	async getListingById(id: string): Promise<ItemListing | null> {
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

			const response = await this.executeGraphQL(query, { id });
		const itemListingData = response.data['itemListing'] as Record<string, unknown> | undefined;
		return itemListingData ? this.deserializeItemListing(itemListingData) : null;
	}

	/**
	* Execute GraphQL request using fetch
	 */
	private async executeGraphQL(
		query: string,
		variables: Record<string, unknown>,
	): Promise<{ data: Record<string, unknown>; errors?: Array<{ message: string }> }> {
		const response = await fetch(this.apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// TODO: Add authentication headers when needed
			},
			body: JSON.stringify({ query, variables }),
		});

		const result = await response.json();

		// Handle GraphQL errors (these come with 200 OK or 400 Bad Request)
		if (result.errors && Array.isArray(result.errors)) {
			// Extract meaningful error message from GraphQL errors
			const errorMessage = result.errors
				.map((err: { message?: string }) => err.message ?? 'Unknown error')
				.join('; ');
			throw new Error(errorMessage);
		}

		if (!response.ok) {
			throw new Error(`GraphQL error: ${response.status} ${response.statusText}`);
		}

		return result;
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
		const result: ItemListing = {
			id: item['id'],
			title: item['title'],
			description: item['description'],
			category: item['category'],
			location: item['location'],
			state: item['state'],
		};

		if (item['images']) {
			result.images = item['images'];
		}
		if (data['sharingPeriodStart']) {
			result.sharingPeriodStart = new Date(String(data['sharingPeriodStart']));
		}
		if (data['sharingPeriodEnd']) {
			result.sharingPeriodEnd = new Date(String(data['sharingPeriodEnd']));
		}

		return result;
	}

}
