// biome-ignore-all lint/complexity/useLiteralKeys: process.env has an index signature returning string | undefined; bracket notation is required to satisfy TypeScript's strict null checking for environment variable access
import crypto, { type KeyObject, type webcrypto } from 'node:crypto';
import express from 'express';
import {
	exportJWK,
	exportPKCS8,
	generateKeyPair,
	type JWK,
	SignJWT,
} from 'jose';
const app = express();
app.disable('x-powered-by');

export type OAuth2Config = {
    port: number;
    baseUrl: string;
    host?: string;
    mockUsers?: {
        users: Record<string, TokenProfile>;
        refreshTokens: Record<string, string>;
    };
    allowedRedirectUris: Set<string>;
    allowedRedirectUri: string;
    redirectUriToAudience: Map<string, string>;
    env?: NodeJS.ProcessEnv;
    getUserProfile: (isAdminPortal: boolean) => {
        email: string;
        given_name: string;
        family_name: string;
    };
};

function normalizeUrl(urlString: string): string {
	try {
		const url = new URL(urlString);
		const pathname = url.pathname.replace(/\/$/, '') || '/';
		const params = new URLSearchParams(url.search);
		params.sort();
		const search = params.toString() ? `?${params.toString()}` : '';
		return `${url.origin}${pathname}${search}`;
	} catch (_e) {
		return urlString;
	}
}

// Type for user profile used in token claims
interface TokenProfile {
	aud: string;
	sub: string;
	iss: string;
	email: string;
	given_name: string;
	family_name: string;
	tid: string;
}

// Helper to generate a token response using jose-managed key
// Note: privateKey and jwk are always jose objects, safe for dev/test. Linter warning for 'any' can be ignored in this context.
async function buildTokenResponse(
	profile: TokenProfile,
	privateKey: webcrypto.CryptoKey | KeyObject | JWK | Uint8Array,
	jwk: { alg?: string; kid?: string },
	baseUrl: string,
	existingRefreshToken?: string,
) {
	const now = Math.floor(Date.now() / 1000);
	const expiresIn = 3600;
	const exp = now + expiresIn;

	// Manually sign the id_token as a JWT with all claims using jose
	const idTokenPayload = {
		iss: baseUrl,
		sub: profile.sub,
		aud: profile.aud,
		email: profile.email,
		given_name: profile.given_name,
		family_name: profile.family_name,
		tid: profile.tid,
		exp,
		iat: now,
		typ: 'id_token',
	};
	const alg = jwk.alg || 'RS256';
	const id_token = await new SignJWT(idTokenPayload)
		.setProtectedHeader({ alg, kid: jwk.kid || '', typ: 'JWT' })
		.setIssuedAt(now)
		.setExpirationTime(exp)
		.sign(privateKey);

	// Manually sign the access_token as a JWT with all claims using jose
	const accessTokenPayload = {
		iss: baseUrl,
		sub: profile.sub,
		aud: profile.aud,
		email: profile.email,
		given_name: profile.given_name,
		family_name: profile.family_name,
		tid: profile.tid,
		exp,
		iat: now,
		typ: 'access_token',
	};
	const access_token = await new SignJWT(accessTokenPayload)
		.setProtectedHeader({ alg, kid: jwk.kid || '', typ: 'JWT' })
		.setIssuedAt(now)
		.setExpirationTime(exp)
		.sign(privateKey);

	// Use existing refresh_token if provided (for refresh flow), otherwise generate new
	const refresh_token = existingRefreshToken || crypto.randomUUID();
	return {
		id_token,
		session_state: null,
		access_token,
		refresh_token,
		token_type: 'Bearer',
		scope: 'openid',
		profile: {
			exp,
			ver: '1.0',
			iss: baseUrl,
			sub: profile.sub,
			aud: profile.aud,
			iat: now,
			email: profile.email,
			given_name: profile.given_name,
			family_name: profile.family_name,
			tid: profile.tid,
		},
		expires_at: exp,
	};
}

// Main async startup
async function main(config: OAuth2Config) {
	// Generate signing keypair with jose
	const { publicKey, privateKey } = await generateKeyPair('RS256');
	const publicJwk = await exportJWK(publicKey);
	const pkcs8 = await exportPKCS8(privateKey);
	const keyObject = crypto.createPrivateKey({
		key: pkcs8,
		format: 'pem',
		type: 'pkcs8',
	});

	// Convert CryptoKey to KeyObject if needed for jose compatibility
	publicJwk.use = 'sig';
	publicJwk.alg = 'RS256';
	publicJwk.kid = publicJwk.kid || 'mock-key';

	// Serve JWKS endpoint from Express
	app.get('/.well-known/jwks.json', (_req, res) => {
		res.json({ keys: [publicJwk] });
	});

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	// Support form-data (multipart/form-data) parsing
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*'); // Allow all origins (for dev)
		res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
		if (req.method === 'OPTIONS') {
			res.sendStatus(200);
			return;
		}
		next();
	});

	// Token endpoint - handles both authorization code and refresh token grants
	app.post('/token', async (req, res) => {
		const { grant_type, refresh_token, tid, code } = req.body;

		// Handle refresh token grant
		if (grant_type === 'refresh_token') {
			if (!refresh_token || !config.mockUsers) {
				return res.status(400).json({ error: 'invalid_grant' });
			}

			const sub = config.mockUsers.refreshTokens[refresh_token];
			if (!sub) {
				return res.status(400).json({ error: 'invalid_grant' });
			}

			const profile = config.mockUsers.users[sub];
			if (!profile) {
				return res.status(400).json({ error: 'invalid_grant' });
			}

			// Issue new tokens, keep the same refresh_token
			const tokenResponse = await buildTokenResponse(
				profile,
				keyObject,
				publicJwk,
				config.baseUrl,
				refresh_token,
			);
			return res.json(tokenResponse);
		}

		// Handle authorization code grant (original flow)
		if (typeof code !== 'string') {
			res.status(400).json({
				error: 'invalid_request',
				error_description: 'code must be a string',
			});
			return;
		}

		// Extract redirect_uri from code (encoded in base64)
		let aud = 'user-portal'; // default audience
		let isAdminPortal = false;

		if (code?.startsWith('mock-auth-code-')) {
			try {
				const base64Part = code.replace('mock-auth-code-', '');
				const decodedRedirectUri = Buffer.from(base64Part, 'base64').toString(
					'utf-8',
				);
				if (config.allowedRedirectUris.has(decodedRedirectUri)) {
					// Map redirect URI to proper audience identifier
					aud = config.redirectUriToAudience.get(decodedRedirectUri) || 'user-portal';
					isAdminPortal = aud === 'admin-portal';
				}
			} catch (e) {
				console.error('Failed to decode redirect_uri from code:', e);
			}
		}

		const userProfile = config.getUserProfile(isAdminPortal);
		const { email, given_name, family_name } = userProfile;
		const profile: TokenProfile = {
			aud: aud, // Now using proper audience identifier
			sub: crypto.randomUUID(),
			iss: config.baseUrl,
			email,
			given_name,
			family_name,
			tid: tid || 'test-tenant-id',
		};
		const tokenResponse = await buildTokenResponse(
			profile,
			keyObject,
			publicJwk,
			config.baseUrl,
		);
		return res.json(tokenResponse);
	});

	app.get('/.well-known/openid-configuration', (_req, res) => {
		res.json({
			issuer: config.baseUrl,
			authorization_endpoint: `${config.baseUrl}/authorize`,
			token_endpoint: `${config.baseUrl}/token`,
			userinfo_endpoint: `${config.baseUrl}/userinfo`,
			jwks_uri: `${config.baseUrl}/.well-known/jwks.json`,
			response_types_supported: ['code', 'token'],
			subject_types_supported: ['public'],
			id_token_signing_alg_values_supported: ['RS256'],
			scopes_supported: [
				'openid',
				'profile',
				'email',
				'user-portal',
				'admin-portal',
			],
			token_endpoint_auth_methods_supported: ['client_secret_post'],
			claims_supported: ['sub', 'email', 'name', 'aud'],
		});
	});

	app.get('/authorize', (req, res) => {
		const { redirect_uri, state } = req.query;
		const requestedRedirectUri = redirect_uri as string;

		const normalizedRequested = normalizeUrl(requestedRedirectUri);

		const isAllowed =
			Array.from(config.allowedRedirectUris).some(
				(allowedUri) => normalizeUrl(allowedUri) === normalizedRequested,
			) || normalizeUrl(config.allowedRedirectUri) === normalizedRequested;

		if (!isAllowed) {
			res.status(400).send('Invalid redirect_uri');
			return;
		}

		// Generate authorization code
		const code = `mock-auth-code-${Buffer.from(requestedRedirectUri).toString('base64')}`;

		try {
			const redirectUrl = new URL(requestedRedirectUri);
			redirectUrl.searchParams.set('code', code);
			if (state) {
				redirectUrl.searchParams.set('state', state as string);
			}

			// Send 302 redirect with Location header explicitly set to allowlisted URL
			const finalUrl = redirectUrl.toString();
			res.setHeader('Location', finalUrl);
			res.status(302).end();
		} catch (_error) {
			res.status(400).send('Invalid redirect_uri format');
		}
		return;
	});

	// UserInfo endpoint - returns current user profile from ID token
	app.get('/userinfo', (req, res) => {
		const authHeader = req.headers.authorization as string | undefined;
		if (!authHeader?.startsWith('Bearer ')) {
			return res.status(401).json({ error: 'unauthorized' });
		}

		try {
			// Extract token and decode (simplified - in production would validate signature)
			const token = authHeader.substring(7);
			const parts = token.split('.');
			if (parts.length !== 3 || !parts[1]) {
				return res.status(401).json({ error: 'invalid_token' });
			}

			const payload = JSON.parse(
				Buffer.from(parts[1], 'base64').toString('utf-8'),
			);

			// Derive username from email (part before @)
			const username = payload.email ? payload.email.split('@')[0] : '';

			// Return user info from token claims
			return res.json({
				sub: payload.sub,
				email: payload.email,
				given_name: payload.given_name,
				family_name: payload.family_name,
				name: `${payload.given_name} ${payload.family_name}`,
				username,
			});
		} catch (_e) {
			return res.status(401).json({ error: 'invalid_token' });
		}
	});

	// HTTP server — portless handles TLS/proxy at the subdomain level
	app.listen(config.port, config.host || 'localhost', () => {
		console.log(`Mock OAuth2 server running on ${config.baseUrl}`);
		console.log(`JWKS endpoint running on ${config.baseUrl}/.well-known/jwks.json`);
	});
}

export async function startMockOAuth2Server(config: OAuth2Config) {
    try {
        await main(config);
    } catch (err) {
        console.error('Failed to start mock OAuth2 server:', err);
        process.exit(1);
    }
}