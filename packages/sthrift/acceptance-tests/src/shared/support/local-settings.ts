import fs from 'node:fs';
import path from 'node:path';

// Single source of truth for local dev config (local.settings.json + .env)

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

function readSettings(): Record<string, string> {
	const root = findWorkspaceRoot();
	const settingsPath = path.join(root, 'apps', 'api', 'local.settings.json');
	const raw = fs.readFileSync(settingsPath, 'utf-8');
	const parsed = JSON.parse(raw) as { Values?: Record<string, string> };
	return parsed.Values ?? {};
}

// Parse .env file (KEY=VALUE per line)
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

const values = readSettings();
const workspaceRoot = findWorkspaceRoot();
const uiEnv = readDotEnv(path.join(workspaceRoot, 'apps', 'ui-sharethrift', '.env'));

const nodeEnv = values['NODE_ENV'] ?? 'development';
const isDevelopment = nodeEnv === 'development';

const cosmosDbConnectionString = values['COSMOSDB_CONNECTION_STRING'] ?? '';
const cosmosDbName = values['COSMOSDB_DBNAME'] ?? 'sharethrift';
const cosmosDbPort = Number(values['COSMOSDB_PORT'] ?? '50000');

const oauthIssuerUrl = values['USER_PORTAL_OIDC_ISSUER'] ?? '';
const oauthJwksEndpoint = values['USER_PORTAL_OIDC_ENDPOINT'] ?? '';
const oauthAudience = values['USER_PORTAL_OIDC_AUDIENCE'] ?? 'user-portal';

const apiGraphqlUrl =
	'https://data-access.sharethrift.localhost:1355/api/graphql';
const uiUrl = 'https://sharethrift.localhost:1355';

const uiClientId = uiEnv['VITE_B2C_CLIENTID'] ?? 'mock-client';
const uiRedirectUri = uiEnv['VITE_B2C_REDIRECT_URI'] ?? `${uiUrl}/auth-redirect-user`;
const uiScope = uiEnv['VITE_B2C_SCOPE'] ?? 'openid user-portal';
const uiAdminClientId = uiEnv['VITE_B2C_ADMIN_CLIENTID'] ?? 'mock-client';
const uiAdminRedirectUri = uiEnv['VITE_B2C_ADMIN_REDIRECT_URI'] ?? `${uiUrl}/auth-redirect-admin`;
const uiAdminScope = uiEnv['VITE_B2C_ADMIN_SCOPE'] ?? 'openid admin-portal';

const apiDir = path.join(workspaceRoot, 'apps', 'api');
const oauth2MockDir = path.join(workspaceRoot, 'apps', 'server-oauth2-mock');
const uiDir = path.join(workspaceRoot, 'apps', 'ui-sharethrift');

export const localSettings = {
	isDevelopment,
	nodeEnv,

	cosmosDbConnectionString,
	cosmosDbName,
	cosmosDbPort,

	oauthIssuerUrl,
	oauthJwksEndpoint,
	oauthAudience,

	apiGraphqlUrl,
	uiUrl,

	uiClientId,
	uiRedirectUri,
	uiScope,
	uiAdminClientId,
	uiAdminRedirectUri,
	uiAdminScope,

	apiDir,
	oauth2MockDir,
	uiDir,
} as const;
