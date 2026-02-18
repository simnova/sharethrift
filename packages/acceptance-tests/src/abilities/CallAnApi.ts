import { Ability, type Actor } from '@serenity-js/core';
import pkg from '@apollo/client';
const { ApolloClient, InMemoryCache, HttpLink } = pkg;
import type { DocumentNode } from '@apollo/client';
import fetch from 'cross-fetch';

/**
 * Serenity/JS Ability to interact with a GraphQL API.
 * 
 * This ability enables actors to execute GraphQL queries and mutations
 * against a real GraphQL API endpoint using Apollo Client.
 */
export class CallAnApi extends Ability {
	private readonly client: ApolloClient<any>;

	constructor(private readonly apiUrl: string) {
		super();
		// Create client without custom fetch - we'll add headers per-request
		this.client = new ApolloClient({
			link: new HttpLink({
				uri: apiUrl,
				fetch,
			}),
			cache: new InMemoryCache(),
			defaultOptions: {
				watchQuery: {
					fetchPolicy: 'no-cache',
				},
				query: {
					fetchPolicy: 'no-cache',
				},
			},
		});
	}

	/**
	 * Execute a GraphQL query
	 */
	async query<TData = any, TVariables = any>(options: {
		query: any;
		variables?: TVariables;
	}): Promise<TData> {
		const result = await this.client.query<TData, TVariables>(options);
		return result.data;
	}

	/**
	 * Execute a GraphQL mutation
	 */
	async mutate<TData = any, TVariables = any>(options: {
		mutation: any;
		variables?: TVariables;
	}): Promise<TData> {
		const result = await this.client.mutate<TData, TVariables>(options);
		if (!result.data) {
			throw new Error('Mutation returned no data');
		}
		return result.data;
	}

	/**
	 * Creates a CallAnApi ability for the given API URL.
	 * 
	 * @param apiUrl - The base URL of the GraphQL API
	 * @returns CallAnApi ability instance
	 */
	static at(apiUrl: string): CallAnApi {
		return new CallAnApi(apiUrl);
	}

	/**
	 * Get this ability from an actor
	 */
	static as(actor: Actor): CallAnApi {
		return actor.abilityTo(CallAnApi);
	}
}
