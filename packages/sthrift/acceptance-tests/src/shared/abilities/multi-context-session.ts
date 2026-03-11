import { Ability } from '@serenity-js/core';
import type { Session, OperationInput, OperationResult } from './session.ts';

// Routes operations to context-specific sessions
export class MultiContextSession extends Ability implements Session {
	private readonly sessions = new Map<string, Session>();

	registerSession(context: string, session: Session): void {
		this.sessions.set(context, session);
	}

	execute<TInput extends OperationInput = OperationInput, TOutput extends OperationResult = OperationResult>(
		operationName: string,
		input: TInput,
	): Promise<TOutput> {
		// Extract context from operation name (e.g., 'listing:create' -> 'listing')
		const [context] = operationName.split(':');

		const session = this.sessions.get(context ?? '');
		if (!session) {
			const availableContexts = Array.from(this.sessions.keys()).join(', ');
			return Promise.reject(
				new Error(
					`No session registered for context '${context}'. Available contexts: ${availableContexts}`,
				),
			);
		}

		return session.execute<TInput, TOutput>(operationName, input);
	}
}
