// --- FAKE: test coverage pipeline ---
// This file exists only to verify SonarCloud coverage reporting on the persistence layer.
// Safe to delete once coverage reporting is confirmed working.

export function buildMongoFilter(criteria: Record<string, unknown>): Record<string, unknown> {
	const filter: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(criteria)) {
		if (value === null || value === undefined) {
			continue;
		}
		if (Array.isArray(value)) {
			filter[key] = { $in: value };
		} else {
			filter[key] = value;
		}
	}
	return filter;
}

export function parseSortDirection(input: string): 1 | -1 {
	const normalized = input.trim().toLowerCase();
	if (normalized === 'desc' || normalized === 'descending' || normalized === '-1') {
		return -1;
	}
	return 1;
}

export function isValidCollectionName(name: string): boolean {
	if (!name || name.length === 0 || name.length > 120) {
		return false;
	}
	return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}
