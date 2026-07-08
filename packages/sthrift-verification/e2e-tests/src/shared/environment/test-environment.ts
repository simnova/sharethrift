let initialized = false;
export const hostnames = {
	api: 'data-access.sharethrift.localhost',
	mockAuth: 'mock-auth.sharethrift.localhost',
	ui: 'sharethrift.localhost',
};

export function buildUrl(hostname: string, path = ''): string {
	return `https://${hostname}:1355${path}`;
}

export function initTestEnvironment(): void {
	if (initialized) return;
	process.env['E2E'] = 'true';
	process.env['COSMOSDB_CONNECTION_STRING'] = 'mongodb://127.0.0.1:50000/sharethrift?replicaSet=globaldb';
	process.env['USER_PORTAL_OIDC_ISSUER'] = buildUrl(hostnames.mockAuth, '/user-portal');
	process.env['USER_PORTAL_OIDC_ENDPOINT'] = `${process.env['USER_PORTAL_OIDC_ISSUER']}/.well-known/jwks.json`;
	initialized = true;
}

export function cleanupTestEnvironment(): void {
	initialized = false;
}
