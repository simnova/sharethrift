import type { Actor } from '@serenity-js/core';

/**
 * Universal Session interface - represents a user's interactive session with any domain.
 *
 * Following Screenplay.js design recommendations:
 * "A Session represents a user (actor) having an interactive session with your system.
 *  A Session will typically be used in two places of your code:
 *  - From your session tasks
 *  - From your UI code (React/Vue components etc)"
 *
 * **Key Design**: Completely domain-agnostic. Works with any bounded context.
 * Domain-specific facades (e.g., ListingSession) wrap this interface and provide
 * context-specific methods (createItemListing, getListingById, etc.).
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export interface Session {
	/**
	 * Execute any domain operation generically.
	 *
	 * @param operationName - Fully qualified operation (e.g., 'listing:create', 'reservation:request')
	 * @param input - Operation-specific input
	 * @returns Operation-specific output
	 */
	execute<TInput = Record<string, unknown>, TOutput = unknown>(
		operationName: string,
		input: TInput,
	): Promise<TOutput>;
}

/**
 * Helper to get Session ability from an actor
 */
export function getSession(actor: Actor): Session {
	// Get first Session ability found
	const actorWithAbilities = actor as unknown as { abilities: Map<unknown, unknown> };
	for (const ability of actorWithAbilities.abilities.values()) {
		if ('execute' in (ability as object)) {
			return ability as Session;
		}
	}
	throw new Error('Actor does not have a Session ability');
}
