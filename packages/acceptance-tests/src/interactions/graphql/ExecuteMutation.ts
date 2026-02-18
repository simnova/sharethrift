import { Interaction, type UsesAbilities, notes } from '@serenity-js/core';
import { CallAnApi } from '../../abilities/CallAnApi.js';
import type { DocumentNode } from '@apollo/client/core';

/**
 * ExecuteMutation is a reusable Interaction for executing GraphQL mutations.
 *
 * This is a low-level interaction that Tasks can compose.
 */
export class ExecuteMutation<TData = any> extends Interaction {
	static called<TData = any>(name: string) {
		return {
			with: (mutation: DocumentNode, variables?: Record<string, any>) =>
				new ExecuteMutation<TData>(name, mutation, variables),
		};
	}

	constructor(
		private readonly operationName: string,
		private readonly mutation: DocumentNode,
		private readonly variables?: Record<string, any>,
		private readonly resultKey: string = 'lastMutationResult',
	) {
		super(`#actor executes GraphQL mutation: ${operationName}`);
	}

	async performAs(actor: UsesAbilities): Promise<void> {
		const api = CallAnApi.as(actor);

		const result = await api.mutate<TData>({
			mutation: this.mutation,
			variables: this.variables,
		});

		await actor.attemptsTo(notes<TData>().set(this.resultKey, result));
	}

	toString = () => `executes ${this.operationName} mutation`;
}
