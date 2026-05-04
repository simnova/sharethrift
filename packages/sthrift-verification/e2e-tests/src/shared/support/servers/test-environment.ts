import { execFileSync } from 'node:child_process';
import { getPortlessPath } from './resolve-portless.ts';

let proxyInitialized = false;
let mongoConnectionString: string | undefined;

export function initTestEnvironment() {
	if (proxyInitialized) return;

	// Ensure portless proxy is running. Uses the default portless state dir so
	// certs are shared with `pnpm run dev` (avoiding extra permission prompts).
	// portless proxy start exits non-zero if already running — that's expected.
	try {
		execFileSync(getPortlessPath(), ['proxy', 'start', '-p', '1355'], {
			timeout: 15_000,
			stdio: 'inherit',
		});
	} catch {
		// Proxy may already be running on port 1355 — that's OK
	}

	proxyInitialized = true;
}

export function buildUrl(hostname: string, path = ''): string {
	return `https://${hostname}:1355${path}`;
}

export function setMongoConnectionString(connStr: string): void {
	mongoConnectionString = connStr;
}

export function getMongoConnectionString(): string {
	if (!mongoConnectionString)
		throw new Error(
			'MongoDB connection string not set. Start MongoDBTestServer first.',
		);
	return mongoConnectionString;
}

export function cleanupTestEnvironment(): void {
	// Don't stop the global portless proxy — it's shared with `pnpm run dev`
	proxyInitialized = false;
	mongoConnectionString = undefined;
}
