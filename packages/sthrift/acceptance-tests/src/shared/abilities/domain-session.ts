import { Ability } from '@serenity-js/core';
import type { Session } from './session.js';

export class DomainSession extends Ability implements Session {
	private operationHandlers = new Map<
		string,
		(input: Record<string, unknown>) => Promise<unknown>
	>();

	static withDirectDomainAccess(): DomainSession {
		return new DomainSession();
	}

	registerOperation(
		operationName: string,
		handler: (input: Record<string, unknown>) => Promise<unknown>,
	): void {
		this.operationHandlers.set(operationName, handler);
	}

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

}
