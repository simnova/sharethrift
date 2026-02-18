import { Ability, type Actor } from '@serenity-js/core';
import pkg from '@apollo/client';
const { ApolloClient, InMemoryCache } = pkg;
import type { NormalizedCacheObject } from '@apollo/client';

/**
 * CallAnApi enables an Actor to interact with the GraphQL API.
 *
 * Used at GRAPHQL and DOM levels to make API requests.
 */
export class CallAnApi extends Ability {
	private client: ApolloClient<NormalizedCacheObject>;

	constructor(private readonly apiUrl: string) {
		super();

		this.client = new ApolloClient({
			uri: this.apiUrl,
			cache: new InMemoryCache(),
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
	 * Factory method to create this ability
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
