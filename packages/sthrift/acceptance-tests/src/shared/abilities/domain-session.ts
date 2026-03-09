import { Ability } from '@serenity-js/core';

export abstract class DomainSession extends Ability {
	protected operations: Map<string, (input: unknown) => Promise<unknown>> = new Map();

	protected registerOperation(
		operationName: string,
		handler: (input: unknown) => Promise<unknown>,
	): void {
		this.operations.set(operationName, handler);
	}

	public execute<Input, Output>(operationName: string, input: Input): Promise<Output> {
		const handler = this.operations.get(operationName);
		if (!handler) {
			throw new Error(`Operation not found: ${operationName}`);
		}
		return handler(input) as Promise<Output>;
	}
}
