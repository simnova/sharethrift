// --- FAKE: test coverage pipeline ---
// Root-level ui-sharethrift coverage probe. Safe to delete.

export function getAppEnvironment(): 'development' | 'staging' | 'production' {
	const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
		?.NODE_ENV;
	if (env === 'production') {
		return 'production';
	}
	if (env === 'staging') {
		return 'staging';
	}
	return 'development';
}

export function buildApiUrl(basePath: string, path: string): string {
	const normalizedBase = basePath.replace(/\/+$/, '');
	const normalizedPath = path.replace(/^\/+/, '');
	return `${normalizedBase}/${normalizedPath}`;
}
