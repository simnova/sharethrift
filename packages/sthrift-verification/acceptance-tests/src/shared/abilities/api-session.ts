import { Ability } from '@serenity-js/core';
import type { Session, OperationInput, OperationResult } from './session.ts';

type ApiOperationHandler = (input: OperationInput) => Promise<OperationResult>;

interface ApiResponseData {
	data: Record<string, unknown>;
	errors?: Array<{ message: string }>;
}

export class ApiSession extends Ability implements Session {
	private readonly operationHandlers = new Map<string, ApiOperationHandler>();

	constructor(
		private readonly apiUrl: string,
		private readonly authToken?: string,
	) {
		super();
	}

	static at(apiUrl: string, authToken?: string): ApiSession {
		return new ApiSession(apiUrl, authToken);
	}

	registerOperation(
		operationName: string,
		handler: ApiOperationHandler,
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
	): Promise<ApiResponseData> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};
		if (this.authToken) {
			headers['Authorization'] = `Bearer ${this.authToken}`;
		}

		const response = await fetch(this.apiUrl, {
			method: 'POST',
			headers,
			body: JSON.stringify({ query, variables }),
		});

		const result = (await response.json()) as ApiResponseData;

		// GraphQL errors may come with 200 OK
		if (result.errors && Array.isArray(result.errors)) {
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
