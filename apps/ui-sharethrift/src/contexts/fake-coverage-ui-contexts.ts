// --- FAKE: test coverage pipeline ---
// Contexts-level ui-sharethrift coverage probe. Safe to delete.

export function mergeContextState<T extends Record<string, unknown>>(
	current: T,
	updates: Partial<T>,
): T {
	const merged = { ...current };
	for (const [key, value] of Object.entries(updates)) {
		if (value !== undefined) {
			(merged as Record<string, unknown>)[key] = value;
		}
	}
	return merged;
}

export function isContextReady(context: { loading: boolean; error: unknown }): boolean {
	return !context.loading && !context.error;
}
