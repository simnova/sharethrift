import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	startMockOAuth2Server,
	type OAuth2Config,
} from '@cellix/server-oauth2-seedwork';

// Setup environment variables
const setupEnvironment = () => {
	console.log('Setting up environment variables');
	dotenv.config();
	dotenv.config({ path: `.env.local`, override: true });
	console.log('Environment variables set up');
};

setupEnvironment();

// Detect certificate availability to determine protocol and base URL
const projectRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../../../../',
);
const certKeyPath = path.join(projectRoot, '.certs/sharethrift.localhost-key.pem');
const certPath = path.join(projectRoot, '.certs/sharethrift.localhost.pem');

// biome-ignore lint:useLiteralKeys
const port = Number(process.env['PORT'] ?? 4000);

const fs = await import('node:fs');
const hasCerts = fs.existsSync(certKeyPath) && fs.existsSync(certPath);

console.log('[mock-oauth2-server] Project root:', projectRoot);
console.log('[mock-oauth2-server] Cert key path:', certKeyPath, 'exists:', fs.existsSync(certKeyPath));
console.log('[mock-oauth2-server] Cert path:', certPath, 'exists:', fs.existsSync(certPath));
console.log('[mock-oauth2-server] hasCerts:', hasCerts);

const BASE_URL = hasCerts
	? `https://mock-auth.sharethrift.localhost:${port}`
	: `http://localhost:${port}`;

const allowedRedirectUris = new Set([
	'http://localhost:3000/auth-redirect-user',
	'http://localhost:3000/auth-redirect-admin',
	'https://sharethrift.localhost:3000/auth-redirect-user',
	'https://sharethrift.localhost:3000/auth-redirect-admin',
]);

// biome-ignore lint:useLiteralKeys
const allowedRedirectUri =
	process.env['ALLOWED_REDIRECT_URI'] ||
	'http://localhost:3000/auth-redirect-user';

const redirectUriToAudience = new Map([
	['http://localhost:3000/auth-redirect-user', 'user-portal'],
	['http://localhost:3000/auth-redirect-admin', 'admin-portal'],
	['https://sharethrift.localhost:3000/auth-redirect-user', 'user-portal'],
	['https://sharethrift.localhost:3000/auth-redirect-admin', 'admin-portal'],
]);

const config: OAuth2Config = {
	port: port,
	baseUrl: BASE_URL,
	host: hasCerts ? 'mock-auth.sharethrift.localhost' : 'localhost',
	allowedRedirectUris: allowedRedirectUris,
	allowedRedirectUri: allowedRedirectUri,
	redirectUriToAudience: redirectUriToAudience,
	hasCerts: hasCerts,
	certKeyPath: certKeyPath,
	certPath: certPath,
	getUserProfile: (isAdminPortal) => {
		// biome-ignore lint:useLiteralKeys
		const email = isAdminPortal
			? process.env['ADMIN_EMAIL'] || process.env['EMAIL'] || ''
			: process.env['EMAIL'] || '';
		// biome-ignore lint:useLiteralKeys
		const given_name = isAdminPortal
			? process.env['ADMIN_GIVEN_NAME'] || process.env['GIVEN_NAME'] || ''
			: process.env['GIVEN_NAME'] || '';
		// biome-ignore lint:useLiteralKeys
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
