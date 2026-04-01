import type { Actor } from '@serenity-js/core';

export type OperationInput = object;
export type OperationResult = object | string | number | boolean | null;

export interface Session {
	context?: string;

	execute<TInput extends OperationInput = OperationInput, TOutput extends OperationResult = OperationResult>(
		operationName: string,
		input: TInput,
	): Promise<TOutput>;
}

export function getSession(actor: Actor, contextHint?: string): Session {
	// Accessing private `abilities` map — requires type assertion to cross Serenity.js internal boundary
	const actorAbilities = (actor as unknown as { abilities: Map<Function, object> }).abilities;
	const sessions: Array<[Function, Session]> = [];

	const entries = Array.from(actorAbilities.entries());
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
			return session.context?.toLowerCase() === contextHint.toLowerCase();
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
