import { Ability, type Actor } from '@serenity-js/core';
import type { DocumentNode } from 'graphql';

/**
 * Mock GraphQL responses for testing GraphQL queries/mutations without real servers.
 *
 * This is a simplified approach that focuses on testing the GraphQL operation structure,
 * not the full infrastructure stack.
 */
export class MockGraphQL extends Ability {
	private responses = new Map<string, any>();
	private nextListingId = 1;

	static withMockedResponses() {
		return new MockGraphQL();
	}

	/**
	 * Execute a mocked GraphQL mutation
	 */
	async executeMutation(
		operationName: string,
		mutation: DocumentNode,
		variables: Record<string, any>,
	): Promise<any> {
		// Check if we have a pre-configured mock response
		const mockedResponse = this.responses.get(operationName);
		if (mockedResponse) {
			return mockedResponse;
		}

		// Otherwise, generate a default mock response based on operation name
		return this.generateMockResponse(operationName, variables);
	}

	/**
	 * Execute a mocked GraphQL query
	 */
	async executeQuery(
		operationName: string,
		query: DocumentNode,
		variables: Record<string, any>,
	): Promise<any> {
		// Check if we have a pre-configured mock response
		const mockedResponse = this.responses.get(operationName);
		if (mockedResponse) {
			return mockedResponse;
		}

		// Otherwise, generate a default mock response
		return this.generateMockResponse(operationName, variables);
	}

	/**
	 * Configure a specific mock response for an operation
	 */
	mockResponse(operationName: string, response: any): this {
		this.responses.set(operationName, response);
		return this;
	}

	/**
	 * Generate default mock responses based on operation name
	 */
	private generateMockResponse(operationName: string, variables: Record<string, any>): any {
		switch (operationName) {
			case 'createItemListing': {
				const listingId = `listing-${this.nextListingId++}`;
				return {
					createItemListing: {
						id: listingId,
						title: variables.input?.title || 'Untitled',
						description: variables.input?.description || '',
						category: variables.input?.category || 'General',
						location: variables.input?.location || 'Unknown',
						state: 'draft',
					},
				};
			}

			case 'activateListing': {
				return {
					activateListing: {
						id: variables.input?.id || 'unknown',
						state: 'published',
					},
				};
			}

			case 'searchListings': {
				return {
					searchListings: {
						items: [],
						total: 0,
					},
				};
			}

			default:
				throw new Error(`No mock response configured for operation: ${operationName}`);
		}
	}

	/**
	 * Required by Serenity/JS Ability interface
	 */
	static as(actor: Actor): MockGraphQL {
		return actor.abilityTo(MockGraphQL);
	}
}
