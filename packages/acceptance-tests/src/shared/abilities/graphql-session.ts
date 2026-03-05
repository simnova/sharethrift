import { Ability } from '@serenity-js/core';
import type { Session } from './session.js';

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
 * **Key Design**: Completely domain-agnostic.
 * Domain-specific logic (listing operations, GraphQL queries, etc.) is provided by context-specific wrappers.
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export class GraphqlSession extends Ability implements Session {
	/**
	 * Map of operation handlers: operationName -> handler function
	 * Populated by domain contexts (e.g., ListingSession registers 'listing:create' handler)
	 */
	private operationHandlers = new Map<
		string,
		(input: Record<string, unknown>) => Promise<unknown>
	>();

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
	 * Register an operation handler.
	 * Domain contexts call this to register their operations.
	 */
	registerOperation(
		operationName: string,
		handler: (input: Record<string, unknown>) => Promise<unknown>,
	): void {
		this.operationHandlers.set(operationName, handler);
	}

	/**
	 * Execute any registered domain operation.
	 * No domain-specific knowledge - just routes to registered handlers.
	 */
	execute<TInput = Record<string, unknown>, TOutput = unknown>(
		operationName: string,
		input: TInput,
	): Promise<TOutput> {
		const handler = this.operationHandlers.get(operationName);
		if (!handler) {
			return Promise.reject(
				new Error(`Operation not registered: '${operationName}'. Available operations: ${Array.from(this.operationHandlers.keys()).join(', ')}`),
			);
		}
		return handler(input as Record<string, unknown>) as Promise<TOutput>;
	}

	/**
	 * Helper to execute GraphQL requests.
	 * Public so domain contexts can use it if needed.
	 */
	async executeGraphQL(
		query: string,
		variables: Record<string, unknown>,
	): Promise<{ data: Record<string, unknown>; errors?: Array<{ message: string }> }> {
		const response = await fetch(this.apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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

}
