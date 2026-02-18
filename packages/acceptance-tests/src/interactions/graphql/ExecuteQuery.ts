import { Interaction, type Actor } from '@serenity-js/core';
import { CallAnApi } from '../../abilities/CallAnApi.js';

/**
 * ExecuteQuery is a reusable Interaction for executing GraphQL queries.
 *
 * This is a low-level interaction that Tasks can compose.
 */
export class ExecuteQuery extends Interaction {
	static called(name: string) {
		return {
			with: (query: any, variables?: any) => new ExecuteQuery(name, query, variables),
		};
	}

	constructor(
		private readonly operationName: string,
		private readonly query?: any,
		private readonly variables?: Record<string, any>,
	) {
		super(`#actor executes GraphQL query: ${operationName}`);
	}	async performAs(actor: Actor): Promise<any> {
		const api = CallAnApi.as(actor);
		const result = await api.query({
			query: this.query,
			variables: this.variables,
		});
		return result;
	}

	toString = () => `executes ${this.operationName} query`;
}
