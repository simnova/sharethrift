// --- FAKE: test coverage pipeline ---
// This file exists only to verify SonarCloud coverage reporting on the graphql layer.
// Safe to delete once coverage reporting is confirmed working.

export function formatGraphQLError(message: string, code?: string): { message: string; code: string } {
	const trimmed = message.trim();
	if (trimmed.length === 0) {
		return { message: 'Unknown error', code: code ?? 'UNKNOWN' };
	}
	return { message: trimmed, code: code ?? 'GRAPHQL_ERROR' };
}

export function extractFieldNames(selectionSet: string): string[] {
	if (!selectionSet || selectionSet.trim().length === 0) {
		return [];
	}
	return selectionSet
		.split(',')
		.map((field) => field.trim())
		.filter((field) => field.length > 0);
}

export function isQueryOperation(operation: string): boolean {
	const normalized = operation.trim().toLowerCase();
	return normalized === 'query' || normalized.startsWith('query ');
}
