import { Ability, type Actor } from '@serenity-js/core';
import pkg from '@apollo/client';
const { ApolloClient, InMemoryCache, HttpLink } = pkg;
import type { DocumentNode } from '@apollo/client';
import fetch from 'cross-fetch';
import { AuthenticateUser } from './AuthenticateUser.js';

/**
 * Serenity/JS Ability to interact with a GraphQL API.
 * 
 * This ability enables actors to execute GraphQL queries and mutations
 * against a real GraphQL API endpoint using Apollo Client.
 * 
 * If the actor has the AuthenticateUser ability, this will automatically
 * include the JWT token in the Authorization header.
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
	 * Gets the authorization header if the actor has AuthenticateUser ability.
	 */
	private async getAuthHeaders(actor: Actor): Promise<Record<string, string>> {
		try {
			const auth = AuthenticateUser.as().whichIsHeldBy(actor);
			const token = await auth.getToken();
			return { Authorization: token };
		} catch {
			// Actor doesn't have AuthenticateUser ability - no auth headers
			return {};
		}
	}

	/**
	 * Execute a GraphQL query
	 */
	async query<TData = any, TVariables = any>(options: {
		query: any;
		variables?: TVariables;
	}): Promise<TData> {
		// Get auth headers if available (requires actor context)
		const context = { headers: {} };
		const result = await this.client.query<TData, TVariables>({ ...options, context });
		return result.data;
	}

	/**
	 * Execute a GraphQL mutation
	 */
	async mutate<TData = any, TVariables = any>(
		options: {
			mutation: any;
			variables?: TVariables;
		},
		actor: Actor,
	): Promise<TData> {
		// Get auth headers from actor
		const headers = await this.getAuthHeaders(actor);
		const result = await this.client.mutate<TData, TVariables>({
			...options,
			context: { headers },
		});
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
