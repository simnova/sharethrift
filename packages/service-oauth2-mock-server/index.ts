
// Use jose to generate and manage the signing key
import { generateKeyPair, exportJWK, SignJWT, type CryptoKey, type JWK } from 'jose';
import express from 'express';
// import { OAuth2Server } from 'oauth2-mock-server';
import crypto, { KeyObject } from 'crypto';
import multer from 'multer';


const app = express();
const upload = multer();
const port = 4001;


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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, 'mock-users.json');

type UserFileData = {
  users: Record<string, TokenProfile>;
  refreshTokens: Record<string, string>;
};

function readUserFile(): UserFileData {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { users: {}, refreshTokens: {} };
  }
}

function writeUserFile(data: UserFileData) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

// Helper to generate a token response using jose-managed key
// Note: privateKey and jwk are always jose objects, safe for dev/test. Linter warning for 'any' can be ignored in this context.
async function buildTokenResponse(
  profile: TokenProfile,
  privateKey: CryptoKey | KeyObject | JWK | Uint8Array,
  jwk: { alg?: string; kid?: string },
  existingRefreshToken?: string
) {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 3600;
  const exp = now + expiresIn;

  // Manually sign the id_token as a JWT with all claims using jose
  const idTokenPayload = {
    iss: 'http://localhost:4001',
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
    .setProtectedHeader({ alg, kid: jwk.kid || "", typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(privateKey);

  // Manually sign the access_token as a JWT with all claims using jose
  const accessTokenPayload = {
    iss: 'http://localhost:4001',
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
    .setProtectedHeader({ alg, kid: jwk.kid || "", typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(privateKey);

  // Use existing refresh_token if provided (for refresh flow), otherwise generate new
  const refresh_token = existingRefreshToken || crypto.randomUUID();
  // Store user and refresh_token mapping in file
  const data = readUserFile();
  data.users[profile.sub] = profile;
  data.refreshTokens[refresh_token] = profile.sub;
  writeUserFile(data);
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
      iss: 'http://localhost:4001',
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
  publicJwk.use = 'sig';
  publicJwk.alg = 'RS256';
  publicJwk.kid = publicJwk.kid || 'mock-key';

  // Serve JWKS endpoint from Express
  app.get('/.well-known/jwks.json', (_req, res) => {
    res.json({ keys: [publicJwk] });
  });

  app.use(express.json());
  // Support form-data (multipart/form-data) parsing
  app.use(upload.none());


  // Simulate sign up endpoint
  app.post('/signup', async (req, res) => {
    // In a real app, validate and create user here
    const { email, given_name, family_name, aud, tid } = req.body;
    const profile: TokenProfile = {
      aud: aud || 'test-client-id',
      sub: crypto.randomUUID(),
      iss: 'http://localhost:4001',
      email,
      given_name,
      family_name,
      tid: tid || 'test-tenant-id',
    };
    const tokenResponse = await buildTokenResponse(profile, privateKey, publicJwk);
    res.json(tokenResponse);
  });

  // OAuth2 /token endpoint for refresh_token grant
  app.post('/token', express.urlencoded({ extended: false }), async (req, res) => {
    const { grant_type, refresh_token } = req.body;
    if (grant_type !== 'refresh_token' || !refresh_token) {
      return res.status(400).json({ error: 'invalid_request' });
    }
    const data = readUserFile();
    const sub = data.refreshTokens[refresh_token];
    if (!sub) {
      return res.status(400).json({ error: 'invalid_grant' });
    }
    const profile = data.users[sub];
    if (!profile) {
      return res.status(400).json({ error: 'invalid_grant' });
    }
    // Issue new tokens for the same user, keep the same refresh_token
    const tokenResponse = await buildTokenResponse(profile, privateKey, publicJwk, refresh_token);
    res.json(tokenResponse);
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Mock OAuth2 server running on http://localhost:${port}`);
    console.log(`JWKS endpoint running on http://localhost:${port}/.well-known/jwks.json`);
  });
}

main();
