import crypto from 'node:crypto';
import express from 'express';
import { exportJWK, exportPKCS8, generateKeyPair, SignJWT } from 'jose';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

interface TestUserProfile {
	email: string;
	given_name: string;
	family_name: string;
	sub: string;
}

/**
 * Lightweight OAuth2/OIDC mock server for E2E acceptance tests.
 *
 * Uses the same JWT signing approach as @cellix/server-oauth2-seedwork
 * but is designed as a programmatic test fixture — starts on a random port,
 * provides a URL, and cleans up when stopped.
 *
 * The /authorize endpoint auto-redirects with a code (no login UI needed),
 * and the /token endpoint issues real JWTs signed with a test key pair.
 */
export class TestOAuth2Server {
	private server: Server | undefined;
	private baseUrl = '';
	private privateKey: crypto.KeyObject | undefined;
	private publicJwk: Record<string, unknown> | undefined;

	private readonly testUser: TestUserProfile;
	private readonly allowedRedirectUris: Set<string>;

	constructor(options?: { testUser?: Partial<TestUserProfile>; allowedRedirectUris?: string[] }) {
		this.testUser = {
			email: options?.testUser?.email ?? 'alice@test.sharethrift.com',
			given_name: options?.testUser?.given_name ?? 'Alice',
			family_name: options?.testUser?.family_name ?? 'Test',
			sub: options?.testUser?.sub ?? 'test-user-sub-001',
		};
		this.allowedRedirectUris = new Set(options?.allowedRedirectUris ?? []);
	}

	async start(): Promise<void> {
		const { publicKey, privateKey } = await generateKeyPair('RS256');
		const publicJwk = await exportJWK(publicKey);
		const pkcs8 = await exportPKCS8(privateKey);
		this.privateKey = crypto.createPrivateKey({ key: pkcs8, format: 'pem', type: 'pkcs8' });
		publicJwk.use = 'sig';
		publicJwk.alg = 'RS256';
		publicJwk.kid = 'e2e-test-key';
		this.publicJwk = publicJwk;

		const app = express();
		app.disable('x-powered-by');
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());

		// CORS for E2E browser requests
		app.use((_req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
			res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
			if (_req.method === 'OPTIONS') {
				res.sendStatus(200);
				return;
			}
			next();
		});

		app.get('/.well-known/openid-configuration', (_req, res) => {
			res.json({
				issuer: this.baseUrl,
				authorization_endpoint: `${this.baseUrl}/authorize`,
				token_endpoint: `${this.baseUrl}/token`,
				userinfo_endpoint: `${this.baseUrl}/userinfo`,
				jwks_uri: `${this.baseUrl}/.well-known/jwks.json`,
				response_types_supported: ['code', 'token'],
				subject_types_supported: ['public'],
				id_token_signing_alg_values_supported: ['RS256'],
				scopes_supported: ['openid', 'profile', 'email', 'user-portal', 'admin-portal'],
				token_endpoint_auth_methods_supported: ['client_secret_post'],
				claims_supported: ['sub', 'email', 'name', 'aud'],
			});
		});

		app.get('/.well-known/jwks.json', (_req, res) => {
			res.json({ keys: [this.publicJwk] });
		});

		// Auto-approve authorize — redirect immediately with a code
		app.get('/authorize', (req, res) => {
			const { redirect_uri, state } = req.query;
			const redirectUri = String(redirect_uri);

			// Validate redirect URI if allowlist is populated
			if (this.allowedRedirectUris.size > 0 && !this.allowedRedirectUris.has(redirectUri)) {
				res.status(400).send('Invalid redirect_uri');
				return;
			}

			const code = `mock-auth-code-${Buffer.from(redirectUri).toString('base64')}`;
			const url = new URL(redirectUri);
			url.searchParams.set('code', code);
			if (state) url.searchParams.set('state', String(state));
			res.redirect(302, url.toString());
		});

		app.post('/token', async (req, res) => {
			const now = Math.floor(Date.now() / 1000);
			const exp = now + 3600;

			const claims = {
				iss: this.baseUrl,
				sub: this.testUser.sub,
				aud: 'user-portal',
				email: this.testUser.email,
				given_name: this.testUser.given_name,
				family_name: this.testUser.family_name,
				tid: 'test-tenant-id',
				exp,
				iat: now,
			};

			const header = { alg: 'RS256', kid: 'e2e-test-key', typ: 'JWT' };

			const id_token = await new SignJWT({ ...claims, typ: 'id_token' })
				.setProtectedHeader(header)
				.setIssuedAt(now)
				.setExpirationTime(exp)
				.sign(this.privateKey!);

			const access_token = await new SignJWT({ ...claims, typ: 'access_token' })
				.setProtectedHeader(header)
				.setIssuedAt(now)
				.setExpirationTime(exp)
				.sign(this.privateKey!);

			res.json({
				id_token,
				access_token,
				refresh_token: crypto.randomUUID(),
				token_type: 'Bearer',
				scope: 'openid',
				session_state: null,
				profile: { ...claims },
				expires_at: exp,
			});
		});

		app.get('/userinfo', (req, res) => {
			const authHeader = req.headers.authorization;
			if (!authHeader?.startsWith('Bearer ')) {
				return res.status(401).json({ error: 'unauthorized' });
			}
			return res.json({
				sub: this.testUser.sub,
				email: this.testUser.email,
				given_name: this.testUser.given_name,
				family_name: this.testUser.family_name,
				name: `${this.testUser.given_name} ${this.testUser.family_name}`,
			});
		});

		return new Promise<void>((resolve) => {
			this.server = app.listen(0, '127.0.0.1', () => {
				const address = this.server!.address() as AddressInfo;
				this.baseUrl = `http://127.0.0.1:${address.port}`;
				resolve();
			});
		});
	}

	getUrl(): string {
		return this.baseUrl;
	}

	async stop(): Promise<void> {
		return new Promise<void>((resolve) => {
			if (this.server) {
				this.server.close(() => resolve());
			} else {
				resolve();
			}
		});
	}

	/**
	 * Generate a pre-built OIDC user session object that can be injected
	 * into sessionStorage to bypass the full OAuth2 redirect flow.
	 *
	 * The key format is `oidc.user:{authority}:{client_id}` — this is what
	 * oidc-client-ts uses to store the authenticated user.
	 */
	async generateOidcUserSession(clientId: string): Promise<{ storageKey: string; storageValue: string }> {
		if (!this.privateKey) {
			throw new Error('OAuth2 server must be started before generating sessions');
		}

		const now = Math.floor(Date.now() / 1000);
		const exp = now + 3600;

		const claims = {
			iss: this.baseUrl,
			sub: this.testUser.sub,
			aud: clientId,
			email: this.testUser.email,
			given_name: this.testUser.given_name,
			family_name: this.testUser.family_name,
			tid: 'test-tenant-id',
			nonce: crypto.randomUUID(),
			exp,
			iat: now,
		};

		const header = { alg: 'RS256' as const, kid: 'e2e-test-key', typ: 'JWT' as const };

		const id_token = await new SignJWT({ ...claims, typ: 'id_token' })
			.setProtectedHeader(header)
			.setIssuedAt(now)
			.setExpirationTime(exp)
			.sign(this.privateKey);

		const access_token = await new SignJWT({ ...claims, typ: 'access_token' })
			.setProtectedHeader(header)
			.setIssuedAt(now)
			.setExpirationTime(exp)
			.sign(this.privateKey);

		const storageKey = `oidc.user:${this.baseUrl}:${clientId}`;
		const storageValue = JSON.stringify({
			id_token,
			access_token,
			token_type: 'Bearer',
			scope: 'openid user-portal',
			profile: {
				sub: this.testUser.sub,
				email: this.testUser.email,
				given_name: this.testUser.given_name,
				family_name: this.testUser.family_name,
				name: `${this.testUser.given_name} ${this.testUser.family_name}`,
				iss: this.baseUrl,
				aud: clientId,
			},
			expires_at: exp,
			session_state: null,
		});

		return { storageKey, storageValue };
	}
}
