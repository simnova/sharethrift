import { Ability, type Actor } from '@serenity-js/core';
import type { Session, CreateItemListingInput, ItemListing } from './Session.js';

/**
 * GraphQLSession - makes real GraphQL calls to the GraphQL API.
 *
 * Following Screenplay.js design recommendations:
 * "The GraphQLSession is where you encapsulate all of the fetch, WebSocket and EventSource logic.
 *  This is the class your UI will use in production. You will also use it in tests."
 *
 * Benefits:
 * - Tests full GraphQL + Domain layer coverage
 * - Same code that production UI uses
 * - Catches integration issues
 *
 * Used by:
 * - Production UI code (React components)
 * - Integration tests (slower but full coverage)
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export class GraphQLSession extends Ability implements Session {
	constructor(private readonly apiUrl: string) {
		super();
	}

	/**
	 * Factory method following Serenity/JS Ability pattern
	 */
	static at(apiUrl: string): GraphQLSession {
		return new GraphQLSession(apiUrl);
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
		return this.deserializeItemListing(response.data.createItemListing);
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
		return response.data.itemListing ? this.deserializeItemListing(response.data.itemListing) : null;
	}

	/**
	* Execute GraphQL request using fetch
	 */
	private async executeGraphQL(query: string, variables: Record<string, any>): Promise<any> {
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
		if (result.errors) {
			// Extract meaningful error message from GraphQL errors
			const errorMessage = result.errors
				.map((err: any) => err.message)
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
	private serializeInput(input: CreateItemListingInput): any {
		return {
			...input,
			sharingPeriodStart: input.sharingPeriodStart.toISOString(),
			sharingPeriodEnd: input.sharingPeriodEnd.toISOString(),
		};
	}

	/**
	 * Deserialize GraphQL response (ISO string -> Date)
	 */
	private deserializeItemListing(data: any): ItemListing {
		return {
			...data,
			sharingPeriodStart: data.sharingPeriodStart ? new Date(data.sharingPeriodStart) : undefined,
			sharingPeriodEnd: data.sharingPeriodEnd ? new Date(data.sharingPeriodEnd) : undefined,
		};
	}

	/**
	 * Required by Serenity/JS Ability interface
	 */
	static as(actor: Actor): GraphQLSession {
		return actor.abilityTo(GraphQLSession);
	}
}
