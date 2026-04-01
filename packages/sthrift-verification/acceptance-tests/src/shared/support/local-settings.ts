import fs from 'node:fs';
import path from 'node:path';

// apiSettings  ← apps/api/local.settings.json
// uiSettings   ← apps/ui-sharethrift/.env

function findWorkspaceRoot(): string {
	let dir = import.meta.dirname;
	while (dir !== path.dirname(dir)) {
		if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) {
			return dir;
		}
		dir = path.dirname(dir);
	}
	throw new Error('Could not find workspace root (pnpm-workspace.yaml)');
}

function readJsonSettings(filePath: string): Record<string, string> {
	const raw = fs.readFileSync(filePath, 'utf-8');
	const parsed = JSON.parse(raw) as { Values?: Record<string, string> };
	return parsed.Values ?? {};
}

function readDotEnv(filePath: string): Record<string, string> {
	if (!fs.existsSync(filePath)) return {};
	const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
	const result: Record<string, string> = {};
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const eqIndex = trimmed.indexOf('=');
		if (eqIndex === -1) continue;
		result[trimmed.slice(0, eqIndex)] = trimmed.slice(eqIndex + 1);
	}
	return result;
}

const workspaceRoot = findWorkspaceRoot();
const apiValues = readJsonSettings(path.join(workspaceRoot, 'apps', 'api', 'local.settings.json'));
const uiValues = readDotEnv(path.join(workspaceRoot, 'apps', 'ui-sharethrift', '.env'));

// API Settings
export const apiSettings = {
	nodeEnv: apiValues['NODE_ENV'] ?? 'development',
	isDevelopment: (apiValues['NODE_ENV'] ?? 'development') === 'development',

	cosmosDbConnectionString: apiValues['COSMOSDB_CONNECTION_STRING'] ?? '',
	cosmosDbName: apiValues['COSMOSDB_DBNAME'] ?? 'sharethrift',
	cosmosDbPort: Number(apiValues['COSMOSDB_PORT'] ?? '50000'),

	userPortalOidcIssuer: apiValues['USER_PORTAL_OIDC_ISSUER'] ?? '',
	userPortalOidcEndpoint: apiValues['USER_PORTAL_OIDC_ENDPOINT'] ?? '',
	userPortalOidcAudience: apiValues['USER_PORTAL_OIDC_AUDIENCE'] ?? 'user-portal',

	adminPortalOidcIssuer: apiValues['ADMIN_PORTAL_OIDC_ISSUER'] ?? '',
	adminPortalOidcEndpoint: apiValues['ADMIN_PORTAL_OIDC_ENDPOINT'] ?? '',
	adminPortalOidcAudience: apiValues['ADMIN_PORTAL_OIDC_AUDIENCE'] ?? 'admin-portal',

	apiGraphqlUrl: apiValues['VITE_FUNCTION_ENDPOINT'] || (() => {
		throw new Error('VITE_FUNCTION_ENDPOINT is required in local.settings.json');
	})(),

	messagingMockUrl: apiValues['MESSAGING_MOCK_URL'] ?? '',
	paymentMockUrl: apiValues['PAYMENT_MOCK_URL'] ?? '',

	// Directories
	apiDir: path.join(workspaceRoot, 'apps', 'api'),
	oauth2MockDir: path.join(workspaceRoot, 'apps', 'server-oauth2-mock'),
	uiDir: path.join(workspaceRoot, 'apps', 'ui-sharethrift'),
} as const;

// UI Settings
const uiBaseUrl = uiValues['VITE_BASE_URL'] || (() => {
	throw new Error('VITE_BASE_URL is required in .env');
})();

export const uiSettings = {
	baseUrl: uiBaseUrl,

	clientId: uiValues['VITE_B2C_CLIENTID'] ?? 'mock-client',
	authority: uiValues['VITE_B2C_AUTHORITY'] ?? apiSettings.userPortalOidcIssuer,
	redirectUri: uiValues['VITE_B2C_REDIRECT_URI'] || (() => {
		throw new Error('VITE_B2C_REDIRECT_URI is required in .env');
	})(),
	scope: uiValues['VITE_B2C_SCOPE'] ?? 'openid user-portal',

	adminClientId: uiValues['VITE_B2C_ADMIN_CLIENTID'] ?? 'mock-client',
	adminAuthority: uiValues['VITE_B2C_ADMIN_AUTHORITY'] ?? apiSettings.adminPortalOidcIssuer,
	adminRedirectUri: uiValues['VITE_B2C_ADMIN_REDIRECT_URI'] || (() => {
		throw new Error('VITE_B2C_ADMIN_REDIRECT_URI is required in .env');
	})(),
	adminScope: uiValues['VITE_B2C_ADMIN_SCOPE'] ?? 'openid admin-portal',

	graphqlEndpoint: uiValues['VITE_FUNCTION_ENDPOINT'] || (() => {
		throw new Error('VITE_FUNCTION_ENDPOINT is required in .env');
	})(),
} as const;
