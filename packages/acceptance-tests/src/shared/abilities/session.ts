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
	 * Optional context identifier for multi-session scenarios (e.g., 'listing', 'reservation')
	 */
	context?: string;

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
 * @param actor The actor to get the session from
 * @param contextHint Optional hint about which session to prefer (e.g., 'listing', 'reservation')
 */
export function getSession(actor: Actor, contextHint?: string): Session {
	const actorWithAbilities = actor as unknown as { abilities: Map<unknown, unknown> };
	const sessions: Array<[unknown, Session]> = [];

	// Collect all session-like abilities
	for (const [key, ability] of actorWithAbilities.abilities.entries()) {
		if ('execute' in (ability as object)) {
			sessions.push([key, ability as Session]);
		}
	}

	if (sessions.length === 0) {
		throw new Error('Actor does not have a Session ability');
	}

	// If we have a context hint and multiple sessions, try to match by context property
	if (contextHint && sessions.length > 1) {
		const hintedSession = sessions.find(([_, session]) => {
			const sessionContext = (session as Session & { context?: string }).context?.toLowerCase();
			return sessionContext === contextHint.toLowerCase();
		});
		if (hintedSession) {
			return hintedSession[1];
		}
	}

	// Default to first session (for backward compatibility)
	return sessions[0][1];
}
