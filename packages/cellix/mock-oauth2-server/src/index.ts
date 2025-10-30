import { setupEnvironment } from './setup-environment.js';
import crypto, { type KeyObject, type webcrypto } from 'node:crypto';
import express from 'express';
import { exportJWK, generateKeyPair, SignJWT, type JWK } from 'jose';
import { exportPKCS8 } from 'jose';

setupEnvironment();
const app = express();
app.disable('x-powered-by');
const port = 4000;
const allowedRedirectUris = new Set([
	'http://localhost:3000/auth-redirect-user',
	'http://localhost:3000/auth-redirect-admin',
]);
// Map redirect URIs to their corresponding audience identifiers
const redirectUriToAudience = new Map([
	['http://localhost:3000/auth-redirect-user', 'user-portal'],
	['http://localhost:3000/auth-redirect-admin', 'admin-portal'],
]);
// Deprecated: kept for backwards compatibility
const allowedRedirectUri =
	// biome-ignore lint:useLiteralKeys
	process.env['ALLOWED_REDIRECT_URI'] ||
	'http://localhost:3000/auth-redirect-user';
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
	existingRefreshToken?: string,
) {
	const now = Math.floor(Date.now() / 1000);
	const expiresIn = 3600;
	const exp = now + expiresIn;

	// Manually sign the id_token as a JWT with all claims using jose
	const idTokenPayload = {
		iss: `http://localhost:${port}}`,
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
		iss: `http://localhost:${port}`,
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
			iss: `http://localhost:${port}`,
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
async function main() {
	// Generate signing keypair with jose
	const { publicKey, privateKey } = await generateKeyPair('RS256');
	const publicJwk = await exportJWK(publicKey);

	//Duy to Review
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

	// Simulate sign up endpoint
	app.post('/token', async (req, res) => {
		const { tid, code } = req.body;

		// Extract redirect_uri from code (encoded in base64)
		let aud = 'user-portal'; // default audience
		let isAdminPortal = false;

		if (code?.startsWith('mock-auth-code-')) {
			try {
				const base64Part = code.replace('mock-auth-code-', '');
				const decodedRedirectUri = Buffer.from(base64Part, 'base64').toString(
					'utf-8',
				);
				if (allowedRedirectUris.has(decodedRedirectUri)) {
					// Map redirect URI to proper audience identifier
					aud = redirectUriToAudience.get(decodedRedirectUri) || 'user-portal';
					isAdminPortal = aud === 'admin-portal';
				}
			} catch (e) {
				console.error('Failed to decode redirect_uri from code:', e);
			}
		}

		// Use different credentials based on portal type
		const email = isAdminPortal
			? process.env['Admin_Email'] || process.env['Email'] || ''
			: process.env['Email'] || '';
		const given_name = isAdminPortal
			? process.env['Admin_Given_Name'] || process.env['Given_Name'] || ''
			: process.env['Given_Name'] || '';
		const family_name = isAdminPortal
			? process.env['Admin_Family_Name'] || process.env['Family_Name'] || ''
			: process.env['Family_Name'] || '';

		const profile: TokenProfile = {
			aud: aud, // Now using proper audience identifier
			sub: crypto.randomUUID(),
			iss: `http://localhost:${port}`,
			email,
			given_name,
			family_name,
			tid: tid || 'test-tenant-id',
		};
		const tokenResponse = await buildTokenResponse(
			profile,
			keyObject,
			publicJwk,
		);
		res.json(tokenResponse);
	});

	app.get('/.well-known/openid-configuration', (_req, res) => {
		res.json({
			issuer: 'http://localhost:4000',
			authorization_endpoint: 'http://localhost:4000/authorize',
			token_endpoint: 'http://localhost:4000/token',
			userinfo_endpoint: 'http://localhost:4000/userinfo',
			jwks_uri: 'http://localhost:4000/.well-known/jwks.json',
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

		// Check if the requested redirect_uri is in our allowed list
		if (
			!allowedRedirectUris.has(requestedRedirectUri) &&
			requestedRedirectUri !== allowedRedirectUri
		) {
			res.status(400).send('Invalid redirect_uri');
			return;
		}

		// Store the redirect_uri in the session/state for the token endpoint
		const code = `mock-auth-code-${Buffer.from(requestedRedirectUri).toString('base64')}`;
		const redirectUrl = `${requestedRedirectUri}?code=${code}${state ? `&state=${state}` : ''}`;
		res.redirect(redirectUrl);
		return;
	});

	app.listen(port, () => {
		// eslint-disable-next-line no-console
		console.log(`Mock OAuth2 server running on http://localhost:${port}`);
		console.log(
			`JWKS endpoint running on http://localhost:${port}/.well-known/jwks.json`,
		);
	});
}

main();
