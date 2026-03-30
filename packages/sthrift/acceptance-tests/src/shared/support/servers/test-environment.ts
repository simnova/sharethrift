import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { getPortlessPath } from './resolve-portless.ts';

let proxyPort: number | undefined;
let mongoConnectionString: string | undefined;

// Use the global portless proxy — same as `pnpm run dev`.
// The CA is trusted via `portless trust` (system keychain for browsers)
// and NODE_EXTRA_CA_CERTS (set in the test:e2e npm script for Node.js).
const globalStateDir = join(homedir(), '.portless');

export async function initTestEnvironment(): Promise<void> {
	if (proxyPort) return;

	// Ensure the global portless proxy is running with HTTPS
	execFileSync(getPortlessPath(), ['proxy', 'start', '--https'], {
		timeout: 15_000,
		stdio: 'pipe',
	});

	try {
		proxyPort = Number.parseInt(readFileSync(join(globalStateDir, 'proxy.port'), 'utf-8').trim(), 10);
	} catch {
		proxyPort = 1355;
	}
}

export function getProxyPort(): number {
	if (!proxyPort) throw new Error('Test environment not initialized. Call initTestEnvironment() first.');
	return proxyPort;
}

export function buildUrl(hostname: string, path = ''): string {
	return `https://${hostname}:${getProxyPort()}${path}`;
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
	proxyPort = undefined;
	mongoConnectionString = undefined;
}
