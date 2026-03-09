import type { Actor } from '@serenity-js/core';

export interface Session {
	context?: string;

	execute<TInput = Record<string, unknown>, TOutput = unknown>(
		operationName: string,
		input: TInput,
	): Promise<TOutput>;
}

export function getSession(actor: Actor, contextHint?: string): Session {
	const actorWithAbilities = actor as unknown as { abilities: Map<unknown, unknown> };
	const sessions: Array<[unknown, Session]> = [];

	const entries = Array.from(actorWithAbilities.abilities.entries());
	for (const [key, ability] of entries) {
		if ('execute' in (ability as object)) {
			sessions.push([key, ability as Session]);
		}
	}

	if (sessions.length === 0) {
		throw new Error('Actor does not have a Session ability');
	}

	if (contextHint && sessions.length > 1) {
		const hintedSession = sessions.find(([_, session]) => {
			const sessionContext = (session as Session & { context?: string }).context?.toLowerCase();
			return sessionContext === contextHint.toLowerCase();
		});
		if (hintedSession) {
			return hintedSession[1];
		}
	}

	const session = sessions[0];
	if (!session) {
		throw new Error('No session found');
	}
	return session[1];
}
