import { Ability } from '@serenity-js/core';
import type { Session } from './session.js';

/**
 * DomainSession - talks directly to the domain layer with direct function calls (no networking).
 *
 * Following Screenplay.js design recommendations:
 * "The DomainSession is an implementation that talks directly to the server side domain layer
 *  with direct function calls (without any networking). This implementation will only be used in tests."
 *
 * Benefits:
 * - Fastest tests (runs in milliseconds)
 * - No network overhead
 * - No HTTP server needed
 * - Tests domain layer coverage only
 *
 * **Key Design**: Completely domain-agnostic.
 * Domain-specific logic (listing operations, etc.) is provided by context-specific wrappers.
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export class DomainSession extends Ability implements Session {
	/**
	 * Map of operation handlers: operationName -> handler function
	 * Populated by domain contexts (e.g., ListingSession registers 'listing:create' handler)
	 */
	private operationHandlers = new Map<
		string,
		(input: Record<string, unknown>) => Promise<unknown>
	>();

	/**
	 * Factory method following Serenity/JS Ability pattern
	 */
	static withDirectDomainAccess(): DomainSession {
		return new DomainSession();
	}

	/**
	 * Register an operation handler.
	 * Domain contexts call this to register their operations.
	 */
	registerOperation(
		operationName: string,
		handler: (input: Record<string, unknown>) => Promise<unknown>,
	): void {
		this.operationHandlers.set(operationName, handler);
	}

	/**
	 * Execute any registered domain operation.
	 * No domain-specific knowledge - just routes to registered handlers.
	 */
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
