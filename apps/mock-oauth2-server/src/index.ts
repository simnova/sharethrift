import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { startMockOAuth2Server } from '@cellix/mock-oauth2-server-seedwork';
import { setupEnvironment } from './setup-environment.js';

setupEnvironment();

const port = Number(process.env['PORT'] ?? 4000);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../');
const certKeyPath = path.join(projectRoot, '.certs/sharethrift.localhost-key.pem');
const certPath = path.join(projectRoot, '.certs/sharethrift.localhost.pem');
const hasCerts = fs.existsSync(certKeyPath) && fs.existsSync(certPath);

const BASE_URL = hasCerts ? `https://mock-auth.sharethrift.localhost:${port}` : `http://localhost:${port}`;

const allowedRedirectUris = new Set([
	'http://localhost:3000/auth-redirect-user',
	'http://localhost:3000/auth-redirect-admin',
	'https://sharethrift.localhost:3000/auth-redirect-user',
	'https://sharethrift.localhost:3000/auth-redirect-admin',
]);

const redirectUriToAudience = new Map([
	['http://localhost:3000/auth-redirect-user', 'user-portal'],
	['http://localhost:3000/auth-redirect-admin', 'admin-portal'],
	['https://sharethrift.localhost:3000/auth-redirect-user', 'user-portal'],
	['https://sharethrift.localhost:3000/auth-redirect-admin', 'admin-portal'],
]);

async function main() {
	try {
		const server = await startMockOAuth2Server(
			{
				port,
				host: hasCerts ? 'mock-auth.sharethrift.localhost' : 'localhost',
				allowedRedirectUris,
				redirectUriToAudience,
				baseUrl: BASE_URL,
			tokenProfileBuilder: (code: string, environment: Record<string, string>) => {
				const isAdminPortal = code?.includes('admin-portal');
				const { Admin_Email, Email, Admin_Given_Name, Given_Name, Admin_Family_Name, Family_Name } = environment;

				const email = isAdminPortal ? Admin_Email || Email || '' : Email || '';
				const given_name = isAdminPortal ? Admin_Given_Name || Given_Name || '' : Given_Name || '';
				const family_name = isAdminPortal ? Admin_Family_Name || Family_Name || '' : Family_Name || '';

				return Promise.resolve({
					aud: isAdminPortal ? 'admin-portal' : 'user-portal',
					sub: crypto.randomUUID(),
					iss: BASE_URL,
					email,
					given_name,
					family_name,
					tid: environment['TID'] || 'test-tenant-id',
				});
			},
			},
			hasCerts ? certPath : undefined,
			hasCerts ? certKeyPath : undefined,
		);

		console.log(`Mock OAuth2 server running on ${BASE_URL}`);
		console.log(`JWKS endpoint running on ${BASE_URL}/.well-known/jwks.json`);

		// Graceful shutdown
		process.on('SIGINT', async () => {
			console.log('\nShutting down Mock OAuth2 server...');
			await server.stop();
			process.exit(0);
		});

		process.on('SIGTERM', async () => {
			console.log('\nShutting down Mock OAuth2 server...');
			await server.stop();
			process.exit(0);
		});
	} catch (error) {
		console.error('Failed to start Mock OAuth2 server:', error);
		process.exit(1);
	}
}

main();
