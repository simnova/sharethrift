import crypto from 'node:crypto';
import { type KeyLike, SignJWT } from 'jose';

interface TokenProfile {
	aud: string;
	sub: string;
	iss: string;
	email?: string;
	given_name?: string;
	family_name?: string;
	tid?: string;
	[key: string]: unknown;
}

export async function buildTokenResponse(
	profile: TokenProfile,
	privateKey: KeyLike,
	jwk: { alg?: string; kid?: string },
	baseUrl: string,
) {
	const now = Math.floor(Date.now() / 1000);
	const expiresIn = 3600;
	const exp = now + expiresIn;

	const {
		sub,
		aud,
		iss: _issuer,
		email,
		given_name,
		family_name,
		tid,
		...extraClaims
	} = profile;
	const idTokenPayload = {
		...extraClaims,
		iss: baseUrl,
		sub,
		aud,
		email,
		given_name,
		family_name,
		tid,
		exp,
		iat: now,
		typ: 'id_token',
	};
	const alg = jwk.alg || 'RS256';
	const id_token = await new SignJWT(idTokenPayload)
		.setProtectedHeader({ alg, kid: jwk.kid || 'mock-key', typ: 'JWT' })
		.setIssuedAt(now)
		.setExpirationTime(exp)
		.sign(privateKey);

	const accessTokenPayload = {
		...extraClaims,
		iss: baseUrl,
		sub,
		aud,
		email,
		given_name,
		family_name,
		tid,
		exp,
		iat: now,
		typ: 'access_token',
	};
	const access_token = await new SignJWT(accessTokenPayload)
		.setProtectedHeader({ alg, kid: jwk.kid || 'mock-key', typ: 'JWT' })
		.setIssuedAt(now)
		.setExpirationTime(exp)
		.sign(privateKey);

	const refresh_token = crypto.randomUUID();
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
			sub,
			aud,
			iat: now,
			...(typeof email === 'string' ? { email } : {}),
			...(typeof given_name === 'string' ? { given_name } : {}),
			...(typeof family_name === 'string' ? { family_name } : {}),
			...(typeof tid === 'string' ? { tid } : {}),
			...extraClaims,
		},
		expires_at: exp,
	};
}
