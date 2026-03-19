import { Ability } from '@serenity-js/core';
import type { OperationInput, OperationResult } from './session.ts';

type DomainOperationHandler = (input: OperationInput) => Promise<OperationResult>;

export abstract class DomainSession extends Ability {
	protected operations: Map<string, DomainOperationHandler> = new Map();

	protected registerOperation(
		operationName: string,
		handler: DomainOperationHandler,
	): void {
		this.operations.set(operationName, handler);
	}

	public execute<Input extends OperationInput, Output extends OperationResult>(operationName: string, input: Input): Promise<Output> {
		const handler = this.operations.get(operationName);
		if (!handler) {
			throw new Error(`Operation not found: ${operationName}`);
		}
		return handler(input) as Promise<Output>;
	}
}
