import { Ability } from '@serenity-js/core';
import type { Session, OperationInput, OperationResult } from './session.ts';

export type GraphQLOperationHandler = (input: OperationInput) => Promise<OperationResult>;

export interface GraphQLResponseData {
	data: Record<string, unknown>;
	errors?: Array<{ message: string }>;
}

export class GraphqlSession extends Ability implements Session {
	private operationHandlers = new Map<string, GraphQLOperationHandler>();

	constructor(private readonly apiUrl: string) {
		super();
	}

	static at(apiUrl: string): GraphqlSession {
		return new GraphqlSession(apiUrl);
	}

	registerOperation(
		operationName: string,
		handler: GraphQLOperationHandler,
	): void {
		this.operationHandlers.set(operationName, handler);
	}

	execute<TInput extends OperationInput = OperationInput, TOutput extends OperationResult = OperationResult>(
		operationName: string,
		input: TInput,
	): Promise<TOutput> {
		const handler = this.operationHandlers.get(operationName);
		if (!handler) {
			return Promise.reject(
				new Error(`Operation not registered: '${operationName}'. Available operations: ${Array.from(this.operationHandlers.keys()).join(', ')}`),
			);
		}
		return handler(input as OperationInput) as Promise<TOutput>;
	}

	async executeGraphQL(
		query: string,
		variables: Record<string, unknown>,
	): Promise<GraphQLResponseData> {
		const response = await fetch(this.apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query, variables }),
		});

		const result = (await response.json()) as GraphQLResponseData;

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
