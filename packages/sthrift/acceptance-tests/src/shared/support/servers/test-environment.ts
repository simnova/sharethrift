// Manages an isolated portless proxy instance for each test run.
// Each run gets its own port and a local .portless state directory (gitignored)
// so TLS certificates are cached and don't prompt for password each run.
// Follows the same pattern as dev (proxy:start → portless <hostname> <cmd>) but
// with a unique port so multiple runs don't conflict.
import net from 'node:net';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

let proxyPort: number | undefined;
let stateDir: string | undefined;
let mongoConnectionString: string | undefined;

function findAvailablePort(): Promise<number> {
	return new Promise((resolve, reject) => {
		const server = net.createServer();
		server.listen(0, '127.0.0.1', () => {
			const addr = server.address();
			if (addr && typeof addr === 'object') {
				const { port } = addr;
				server.close(() => resolve(port));
			} else {
				server.close(() => reject(new Error('Could not determine port')));
			}
		});
		server.on('error', reject);
	});
}

export async function initTestEnvironment(): Promise<void> {
	if (proxyPort) return;

	proxyPort = await findAvailablePort();
	// Store portless state in a local .portless directory (gitignored) so TLS
	// certificates are cached across runs and don't require password prompts.
	stateDir = join(import.meta.dirname, '.portless');

	// Set process-wide env vars so all subsequent portless invocations use our isolated instance
	process.env['PORTLESS_PORT'] = String(proxyPort);
	process.env['PORTLESS_STATE_DIR'] = stateDir;
	process.env['PORTLESS_HTTPS'] = '1';

	// Start the portless proxy daemon on our unique port
	execSync('portless proxy start --https', {
		env: process.env,
		timeout: 15_000,
		stdio: 'pipe',
	});
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
	if (stateDir) {
		try {
			execSync('portless proxy stop', {
				env: process.env,
				timeout: 5_000,
				stdio: 'pipe',
			});
		} catch {
			// Proxy might already be stopped
		}
		// Keep .portless directory — it caches TLS certificates across runs
	}

	delete process.env['PORTLESS_PORT'];
	delete process.env['PORTLESS_STATE_DIR'];
	delete process.env['PORTLESS_HTTPS'];

	proxyPort = undefined;
	stateDir = undefined;
	mongoConnectionString = undefined;
}
