import { Interaction, Question, type Actor, type Answerable, type AnswersQuestions } from '@serenity-js/core';
import type { DocumentNode } from 'graphql';
import { MockGraphQL } from '../../abilities/MockGraphQL.js';

/**
 * Execute a GraphQL mutation using mocked responses.
 *
 * Simplified approach: tests GraphQL operation structure without real servers.
 */
export class ExecuteMutation extends Question<Promise<any>> {
	static called(operationName: string) {
		return new ExecuteMutationBuilder(operationName);
	}

	private constructor(
		private readonly operationName: string,
		private readonly mutation: DocumentNode,
		private readonly variables: Record<string, any>,
	) {
		super(`executes ${operationName} mutation (mocked)`);
	}

	async answeredBy(actor: AnswersQuestions): Promise<any> {
		const mockGraphQL = MockGraphQL.as(actor as Actor);
		return await mockGraphQL.executeMutation(
			this.operationName,
			this.mutation,
			this.variables,
		);
	}

	toString = () => `executes ${this.operationName} mutation (mocked)`;
}

class ExecuteMutationBuilder {
	constructor(private readonly operationName: string) {}

	with(mutation: DocumentNode, variables: Record<string, any>): ExecuteMutation {
		return new ExecuteMutation(this.operationName, mutation, variables);
	}
}
