import path from 'node:path';
import {
	findWorkspaceRoot,
	readDotEnv,
	readJsonSettings,
	readSetting,
	requireSetting,
	resolveWorkspacePath,
} from './settings-utils.ts';

const workspaceRoot = findWorkspaceRoot();
const apiSettingsPath = resolveWorkspacePath(
	workspaceRoot,
	'apps/api/local.settings.json',
);
const uiEnvPath = resolveWorkspacePath(
	workspaceRoot,
	'apps/ui-sharethrift/.env',
);
const adminUiEnvPath = resolveWorkspacePath(
	workspaceRoot,
	'apps/ui-admin/.env',
);

const apiValues = readJsonSettings(apiSettingsPath);
const uiValues = readDotEnv(uiEnvPath);
const adminUiValues = readDotEnv(adminUiEnvPath);

export const apiSettings = {
	nodeEnv: readSetting(apiValues, 'NODE_ENV', 'development') ?? 'development',
	isDevelopment:
		(readSetting(apiValues, 'NODE_ENV', 'development') ?? 'development') ===
		'development',

	cosmosDbConnectionString:
		readSetting(apiValues, 'COSMOSDB_CONNECTION_STRING') ?? '',
	cosmosDbName:
		readSetting(apiValues, 'COSMOSDB_DBNAME', 'sharethrift') ?? 'sharethrift',
	cosmosDbPort: Number(readSetting(apiValues, 'COSMOSDB_PORT', '50000')),

	userPortalOidcIssuer: readSetting(apiValues, 'USER_PORTAL_OIDC_ISSUER') ?? '',
	userPortalOidcEndpoint:
		readSetting(apiValues, 'USER_PORTAL_OIDC_ENDPOINT') ?? '',
	userPortalOidcAudience:
		readSetting(apiValues, 'USER_PORTAL_OIDC_AUDIENCE', 'user-portal') ?? '',

	adminPortalOidcIssuer:
		readSetting(apiValues, 'ADMIN_PORTAL_OIDC_ISSUER') ?? '',
	adminPortalOidcEndpoint:
		readSetting(apiValues, 'ADMIN_PORTAL_OIDC_ENDPOINT') ?? '',
	adminPortalOidcAudience:
		readSetting(apiValues, 'ADMIN_PORTAL_OIDC_AUDIENCE', 'admin-portal') ?? '',

	apiGraphqlUrl: requireSetting(
		apiValues,
		'VITE_FUNCTION_ENDPOINT',
		'VITE_FUNCTION_ENDPOINT is required in local.settings.json',
	),

	messagingMockUrl: readSetting(apiValues, 'MESSAGING_MOCK_URL') ?? '',
	paymentMockUrl: readSetting(apiValues, 'PAYMENT_MOCK_URL') ?? '',

	apiDir: path.dirname(apiSettingsPath),
	oauth2MockDir: path.join(workspaceRoot, 'apps', 'server-oauth2-mock'),
	uiDir: path.dirname(uiEnvPath),
} as const;

export const uiSettings = {
	baseUrl: requireSetting(
		uiValues,
		'VITE_BASE_URL',
		'VITE_BASE_URL is required in .env',
	),

	clientId: readSetting(uiValues, 'VITE_B2C_CLIENTID', 'mock-client') ?? '',
	authority:
		readSetting(uiValues, 'VITE_B2C_AUTHORITY') ??
		apiSettings.userPortalOidcIssuer,
	redirectUri: requireSetting(
		uiValues,
		'VITE_B2C_REDIRECT_URI',
		'VITE_B2C_REDIRECT_URI is required in .env',
	),
	scope: readSetting(uiValues, 'VITE_B2C_SCOPE', 'openid user-portal') ?? '',

	adminClientId:
		readSetting(adminUiValues, 'VITE_B2C_ADMIN_CLIENTID', 'mock-client') ?? '',
	adminAuthority:
		readSetting(adminUiValues, 'VITE_B2C_ADMIN_AUTHORITY') ??
		apiSettings.adminPortalOidcIssuer,
	adminRedirectUri: requireSetting(
		adminUiValues,
		'VITE_B2C_ADMIN_REDIRECT_URI',
		'VITE_B2C_ADMIN_REDIRECT_URI is required in apps/ui-admin/.env',
	),
	adminScope:
		readSetting(adminUiValues, 'VITE_B2C_ADMIN_SCOPE', 'openid admin-portal') ??
		'',

	graphqlEndpoint: requireSetting(
		uiValues,
		'VITE_FUNCTION_ENDPOINT',
		'VITE_FUNCTION_ENDPOINT is required in .env',
	),
} as const;
