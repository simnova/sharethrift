import { execFileSync } from 'node:child_process';
import { getPortlessPath } from './resolve-portless.ts';

let proxyInitialized = false;
let mongoConnectionString: string | undefined;

export function initTestEnvironment() {
	if (proxyInitialized) return;

	// Ensure the shared local portless proxy is running on the fixed non-root HTTPS port.
	// Force PORTLESS_STATE_DIR so the proxy uses ~/.portless/ (not /tmp/portless/)
	// to keep the CA cert path consistent with NODE_EXTRA_CA_CERTS.
	execFileSync(getPortlessPath(), ['proxy', 'start', '-p', '1355'], {
		timeout: 15_000,
		stdio: 'pipe',
		env: {
			...process.env,
			PORTLESS_PORT: '1355',
			PORTLESS_STATE_DIR: `${process.env.HOME}/.portless`,
		},
	});

	proxyInitialized = true;
}

export function buildUrl(hostname: string, path = ''): string {
	return `https://${hostname}:1355${path}`;
}

export function setMongoConnectionString(connStr: string): void {
	mongoConnectionString = connStr;
}

export function getMongoConnectionString(): string {
	if (!mongoConnectionString) throw new Error('MongoDB connection string not set. Start MongoDBTestServer first.');
	return mongoConnectionString;
}

export function cleanupTestEnvironment(): void {
	// Don't stop the global portless proxy — it's shared with `pnpm run dev`
	proxyInitialized = false;
	mongoConnectionString = undefined;
}
