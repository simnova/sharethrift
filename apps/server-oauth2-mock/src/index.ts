import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	startMockOAuth2Server,
	type OAuth2Config,
} from '@cellix/server-oauth2-seedwork';

import { setupEnvironment } from './setup-environment.js';

// Setup environment variables before using them
setupEnvironment();

// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
const port = Number(process.env['PORT'] ?? 4000);

const BASE_URL = process.env['BASE_URL'] ?? 'https://mock-auth.sharethrift.localhost:1355';

// Extract host from BASE_URL
const baseUrlHost = new URL(BASE_URL).hostname;

const allowedRedirectUris = new Set([
	'http://localhost:3000/auth-redirect-user',
	'http://localhost:3000/auth-redirect-admin',
	'https://sharethrift.localhost:1355/auth-redirect-user',
	'https://sharethrift.localhost:1355/auth-redirect-admin',
]);

const allowedRedirectUri =
	process.env['ALLOWED_REDIRECT_URI'] ||
	'http://localhost:3000/auth-redirect-user';

const redirectUriToAudience = new Map([
	['http://localhost:3000/auth-redirect-user', 'user-portal'],
	['http://localhost:3000/auth-redirect-admin', 'admin-portal'],
	['https://sharethrift.localhost:1355/auth-redirect-user', 'user-portal'],
	['https://sharethrift.localhost:1355/auth-redirect-admin', 'admin-portal'],
]);



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, '../../mock-users.json');

const mockUsersData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

const config: OAuth2Config = {
	port,
	baseUrl: BASE_URL,
	host: baseUrlHost,
	allowedRedirectUris,
	allowedRedirectUri,
	redirectUriToAudience,
	mockUsers: mockUsersData,
	getUserProfile: (isAdminPortal) => {
		const email = isAdminPortal
			? process.env['ADMIN_EMAIL'] || process.env['EMAIL'] || ''
			: process.env['EMAIL'] || '';
		const given_name = isAdminPortal
			? process.env['ADMIN_GIVEN_NAME'] || process.env['GIVEN_NAME'] || ''
			: process.env['GIVEN_NAME'] || '';
		const family_name = isAdminPortal
			? process.env['ADMIN_FAMILY_NAME'] || process.env['FAMILY_NAME'] || ''
			: process.env['FAMILY_NAME'] || '';
		return { email, given_name, family_name };
	},
};

startMockOAuth2Server(config).catch((err: unknown) => {
	console.error('Failed to start mock OAuth2 server:', err);
	process.exit(1);
});
