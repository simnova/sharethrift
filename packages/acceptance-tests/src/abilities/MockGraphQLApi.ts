import { Ability, type Actor } from '@serenity-js/core';
import { randomUUID } from 'node:crypto';

/**
 * MockGraphQLApi enables an Actor to interact with a mocked GraphQL API.
 *
 * Returns canned responses for mutations/queries without making real HTTP calls.
 * Used at GRAPHQL level for fast, isolated testing.
 */
export class MockGraphQLApi extends Ability {
	private listings = new Map<string, any>();

	/**
	 * Execute a GraphQL query (mocked)
	 */
	async query<TData = any, TVariables = any>(options: {
		query: any;
		variables?: TVariables;
	}): Promise<TData> {
		// Extract operation name from query
		const operationName = this.extractOperationName(options.query);

		switch (operationName) {
			case 'GetListing':
				return this.mockGetListing(options.variables) as TData;
			default:
				throw new Error(`Unmocked query: ${operationName}`);
		}
	}

	/**
	 * Execute a GraphQL mutation (mocked)
	 */
	async mutate<TData = any, TVariables = any>(options: {
		mutation: any;
		variables?: TVariables;
	}): Promise<TData> {
		// Extract operation name from mutation
		const operationName = this.extractOperationName(options.mutation);
		console.log(`[MOCK API] Mutation: ${operationName}`, options.variables);

		let result: any;
		switch (operationName) {
			case 'CreateItemListing':
				result = this.mockCreateListing(options.variables);
				break;
			case 'ActivateItemListing':
				result = this.mockActivateListing(options.variables);
				break;
			default:
				throw new Error(`Unmocked mutation: ${operationName}`);
		}
		
		console.log(`[MOCK API] Result:`, result);
		return result as TData;
	}

	/**
	 * Mock: Create a new listing
	 */
	private mockCreateListing(variables: any): any {
		const id = `mock-listing-${randomUUID()}`;
		const input = variables?.input || {};

		const listing = {
			id,
			title: input.title,
			description: input.description,
			category: input.category,
			location: input.location,
			state: 'DRAFT',
			sharingPeriodStart: input.sharingPeriodStart,
			sharingPeriodEnd: input.sharingPeriodEnd,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		this.listings.set(id, listing);

		return {
			createItemListing: listing,
		};
	}

	/**
	 * Mock: Activate a listing
	 */
	private mockActivateListing(variables: any): any {
		const id = variables?.id;
		const listing = this.listings.get(id);

		if (!listing) {
			throw new Error(`Listing not found: ${id}`);
		}

		listing.state = 'ACTIVE';
		listing.updatedAt = new Date().toISOString();

		return {
			activateItemListing: {
				success: true,
				listing: {
					id: listing.id,
					state: listing.state,
				},
			},
		};
	}

	/**
	 * Mock: Get a listing by ID
	 */
	private mockGetListing(variables: any): any {
		const id = variables?.id;
		const listing = this.listings.get(id);

		if (!listing) {
			throw new Error(`Listing not found: ${id}`);
		}

		return {
			listing,
		};
	}

	/**
	 * Extract operation name from GraphQL DocumentNode
	 */
	private extractOperationName(document: any): string {
		// Apollo Client gql returns a DocumentNode with definitions
		if (document?.definitions?.[0]?.name?.value) {
			return document.definitions[0].name.value;
		}
		throw new Error('Could not extract operation name from GraphQL document');
	}

	/**
	 * Factory method to create this ability
	 */
	static withMockedResponses(): MockGraphQLApi {
		return new MockGraphQLApi();
	}

	/**
	 * Get this ability from an actor (compatible with CallAnApi interface)
	 */
	static as(actor: Actor): MockGraphQLApi {
		return actor.abilityTo(MockGraphQLApi);
	}
}
