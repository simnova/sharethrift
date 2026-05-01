// biome-ignore-all lint/complexity/useLiteralKeys: process.env uses indexed access to satisfy TS4111 in this package
import path from 'node:path';

import {
	createMockOAuth2Manager,
	type MockOAuth2PortalConfig,
	type MockOAuth2UserProfileRequestContext,
	normalizeBaseUrl,
} from '@cellix/server-oauth2-seedwork';

import {
	discoverPortalConfigs,
	type PortalOidcConfig,
} from './portal-discovery.ts';
import { setupEnvironment } from './setup-environment.ts';

// Setup environment variables before using them
setupEnvironment();

const port = Number(process.env['PORT'] ?? 4000);

const BASE_URL =
	process.env['BASE_URL'] ?? 'https://mock-auth.sharethrift.localhost';

const baseUrl = normalizeBaseUrl(
	process.env['PORTLESS_URL'] ?? BASE_URL ?? `http://localhost:${port}`,
);

// Discover sibling UI apps from the app package cwd used by both dev and e2e.
const appsDir = path.resolve(process.cwd(), '..');

const portals: PortalOidcConfig[] = discoverPortalConfigs(appsDir);

if (portals.length === 0) {
	console.error(
		'[server-oauth2-mock] No portal configs discovered. Ensure at least one apps/ui-*/mock-oidc.json exists.',
	);
	process.exit(1);
}

try {
	const manager = createMockOAuth2Manager({
		port,
		host: '127.0.0.1',
		baseUrl: normalizeBaseUrl(baseUrl),
	});

	for (const portal of portals) {
		const claims = portal.claims as Record<string, unknown>;

		const config: MockOAuth2PortalConfig = {
			allowedRedirectUris: new Set([portal.redirectUri]),
			allowedRedirectUri: portal.redirectUri,
			redirectUriToAudience: new Map([[portal.redirectUri, portal.name]]),
			getUserProfile: (
				requestContext?: MockOAuth2UserProfileRequestContext,
			) => {
				// Destructure sub separately so we can omit it when not explicitly configured,
				// allowing the router to fall back to persistedSub (stable per auth-code).
				const { sub: claimsSub, ...restClaims } = claims;

				const ensureStringClaim = (key: string, fallback: string): string => {
					const value = claims[key];
					if (value === undefined || value === null) return fallback;
					if (typeof value === 'string') return value;
					console.warn(
						`[server-oauth2-mock] Ignoring non-string value for reserved claim "${key}" in portal "${portal.name}". ` +
							`Using fallback "${fallback}" instead.`,
					);
					return fallback;
				};

				if (requestContext?.option === 'signup') {
					const signupNonce = requestContext.signupNonce ?? 'new-user';
					const signupSlug = signupNonce
						.toLowerCase()
						.replace(/[^a-z0-9-]/g, '');
					return {
						...restClaims,
						sub: signupNonce,
						email: `signup-${signupSlug}@sharethrift.local`,
						given_name: ensureStringClaim('given_name', 'New'),
						family_name: ensureStringClaim('family_name', 'User'),
						tid: ensureStringClaim('tid', 'test-tenant-id'),
					};
				}

				return {
					// spread restClaims (all except sub) first; known fields below override
					...restClaims,
					// Only include sub if explicitly configured as a string; absent sub means
					// the router uses persistedSub for stable identity across /token calls.
					...(typeof claimsSub === 'string' ? { sub: claimsSub } : {}),
					email: ensureStringClaim('email', 'test@example.com'),
					given_name: ensureStringClaim('given_name', 'Test'),
					family_name: ensureStringClaim('family_name', 'User'),
					tid: ensureStringClaim('tid', 'test-tenant-id'),
				};
			},
		};

		await manager.register(portal.name, config);
		console.log(
			`[server-oauth2-mock] Registered portal: ${portal.name} → ${normalizeBaseUrl(baseUrl)}/${portal.name}`,
		);
	}
} catch (err: unknown) {
	console.error('Failed to start mock OAuth2 server:', err);
	process.exit(1);
}
