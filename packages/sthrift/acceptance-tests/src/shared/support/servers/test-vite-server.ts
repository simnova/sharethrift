import { createServer, type ViteDevServer } from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

/**
 * Programmatic Vite dev server for E2E acceptance tests.
 *
 * Starts the UI application on a random port with environment variables
 * pointing at the test GraphQL and OAuth2 servers, so the real frontend talks
 * to the test infrastructure.
 *
 * Uses a temporary .env file (via Vite's envDir) to override the UI's
 * environment variables — this is more reliable than `define` because the
 * UI code destructures `import.meta.env`.
 */
export class TestViteServer {
	private server: ViteDevServer | undefined;
	private baseUrl = '';
	private envDir: string | undefined;

	constructor(
		private readonly options: {
			graphqlUrl: string;
			oauth2Url: string;
		},
	) {}

	async start(): Promise<void> {
		const uiRoot = path.resolve(
			import.meta.dirname,
			'../../../../../../../apps/ui-sharethrift',
		);

		// Phase 1: Start on port 0 to discover a free port
		this.server = await createServer({
			root: uiRoot,
			configFile: path.join(uiRoot, 'vite.config.ts'),
			server: { port: 0, strictPort: false, host: '127.0.0.1' },
			logLevel: 'silent',
		});
		await this.server.listen();

		const addressInfo = this.server.httpServer?.address();
		if (addressInfo && typeof addressInfo === 'object') {
			this.baseUrl = `http://127.0.0.1:${addressInfo.port}`;
		}
		await this.server.close();

		// Phase 2: Write a temp .env file with test URLs (now that we know the port)
		this.envDir = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-vite-env-'));
		const envContent = [
			`VITE_B2C_CLIENTID=e2e-test-client`,
			`VITE_B2C_AUTHORITY=${this.options.oauth2Url}`,
			`VITE_B2C_REDIRECT_URI=${this.baseUrl}/auth-redirect-user`,
			`VITE_B2C_SCOPE=openid user-portal`,
			`VITE_FUNCTION_ENDPOINT=${this.options.graphqlUrl}`,
			`VITE_B2C_ADMIN_CLIENTID=e2e-test-client`,
			`VITE_B2C_ADMIN_AUTHORITY=${this.options.oauth2Url}`,
			`VITE_B2C_ADMIN_REDIRECT_URI=${this.baseUrl}/auth-redirect-admin`,
			`VITE_B2C_ADMIN_SCOPE=openid admin-portal`,
		].join('\n');
		fs.writeFileSync(path.join(this.envDir, '.env'), envContent);

		// Phase 3: Restart Vite on the same port with test env vars
		this.server = await createServer({
			root: uiRoot,
			configFile: path.join(uiRoot, 'vite.config.ts'),
			envDir: this.envDir,
			server: {
				port: Number(new URL(this.baseUrl).port),
				strictPort: true,
				host: '127.0.0.1',
			},
			logLevel: 'silent',
		});
		await this.server.listen();
	}

	getUrl(): string {
		return this.baseUrl;
	}

	async stop(): Promise<void> {
		if (this.server) {
			await this.server.close();
			this.server = undefined;
		}
		// Clean up the temp env directory
		if (this.envDir) {
			fs.rmSync(this.envDir, { recursive: true, force: true });
			this.envDir = undefined;
		}
	}
}
