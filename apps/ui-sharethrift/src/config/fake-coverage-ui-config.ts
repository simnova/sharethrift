// --- FAKE: test coverage pipeline ---
// Config-level ui-sharethrift coverage probe. Safe to delete.

export function parseFeatureFlags(raw: string | undefined): Record<string, boolean> {
	if (!raw || raw.trim().length === 0) {
		return {};
	}
	const flags: Record<string, boolean> = {};
	for (const entry of raw.split(',')) {
		const [key, value] = entry.split('=').map((s) => s.trim());
		if (key && key.length > 0) {
			flags[key] = value === 'true' || value === '1';
		}
	}
	return flags;
}

export function getConfigValue<T>(
	config: Record<string, unknown>,
	key: string,
	fallback: T,
): T {
	const value = config[key];
	if (value === undefined || value === null) {
		return fallback;
	}
	return value as T;
}
