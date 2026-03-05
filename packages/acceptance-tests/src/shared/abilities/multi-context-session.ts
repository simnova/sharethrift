import { Ability } from '@serenity-js/core';
import type { Session } from './session.js';

/**
 * MultiContextSession - Routes operations to the appropriate context-specific session
 *
 * Wraps multiple context-specific sessions (e.g., ListingSession, ReservationRequestSession)
 * and delegates execute() calls to the right one based on the operation name prefix.
 */
export class MultiContextSession extends Ability implements Session {
	private readonly sessions = new Map<string, Session>();

	/**
	 * Register a context-specific session
	 */
	registerSession(context: string, session: Session): void {
		this.sessions.set(context, session);
	}

	/**
	 * Execute an operation by routing to the appropriate context-specific session
	 */
	execute<TInput = Record<string, unknown>, TOutput = unknown>(
		operationName: string,
		input: TInput,
	): Promise<TOutput> {
		// Extract context from operation name (e.g., 'listing:create' -> 'listing')
		const [context] = operationName.split(':');

		const session = this.sessions.get(context);
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
