import * as fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { discoverPortalConfigs } from '../src/portal-discovery.ts';

function makeTmpDir(): string {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-discovery-'));
	return dir;
}

function writeJson(dir: string, relPath: string, obj: unknown) {
	const p = path.join(dir, relPath);
	fs.mkdirSync(path.dirname(p), { recursive: true });
	fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf-8');
}

function writeEnv(dir: string, relPath: string, content: string) {
	const p = path.join(dir, relPath);
	fs.mkdirSync(path.dirname(p), { recursive: true });
	fs.writeFileSync(p, content, 'utf-8');
}

function makePortal(
	tmp: string,
	dirName: string,
	config: {
		name: string;
		clientId: string;
		redirectUri: string;
		claims?: Record<string, unknown>;
	},
) {
	writeJson(tmp, `${dirName}/mock-oidc.json`, {
		name: config.name,
		envVars: { clientId: 'VITE_CLIENT_ID', redirectUri: 'VITE_REDIRECT_URI' },
		claims: config.claims ?? { sub: '1' },
	});
	writeEnv(
		tmp,
		`${dirName}/.env`,
		`VITE_CLIENT_ID=${config.clientId}\nVITE_REDIRECT_URI=${config.redirectUri}\n`,
	);
}

describe('discoverPortalConfigs', () => {
	let tmp: string;

	beforeEach(() => {
		tmp = makeTmpDir();
	});

	afterEach(() => {
		fs.rmSync(tmp, { recursive: true, force: true });
	});

	it('discovers portals from ui-* directories', () => {
		makePortal(tmp, 'ui-a', {
			name: 'a',
			clientId: 'client-a',
			redirectUri: 'https://a/cb',
		});

		const portals = discoverPortalConfigs(tmp);
		expect(portals).toHaveLength(1);
		const portal = portals[0];
		expect(portal).toBeDefined();
		expect(portal?.name).toBe('a');
		expect(portal?.clientId).toBe('client-a');
		expect(portal?.redirectUri).toBe('https://a/cb');
	});

	it('warns and falls back to base config when mock-oidc.local.json is malformed', () => {
		makePortal(tmp, 'ui-bad-local', {
			name: 'bad-local-test',
			clientId: 'cid',
			redirectUri: 'https://r/cb',
			claims: { sub: '00000000-0000-4000-8000-000000000001' },
		});
		// Write malformed local override
		fs.writeFileSync(
			path.join(tmp, 'ui-bad-local', 'mock-oidc.local.json'),
			'{ invalid json }',
		);

		const warnSpy = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		try {
			const portals = discoverPortalConfigs(tmp);
			expect(portals).toHaveLength(1);
			const portal = portals[0];
			expect(portal).toBeDefined();
			const claims = portal?.claims as { sub?: string } | undefined;
			expect(claims?.sub).toBe('00000000-0000-4000-8000-000000000001');
			expect(warnSpy).toHaveBeenCalled();
		} finally {
			warnSpy.mockRestore();
		}
	});

	it('skips portal with invalid name', () => {
		writeJson(tmp, 'ui-bad/mock-oidc.json', {
			name: 'bad/name',
			envVars: { clientId: 'C', redirectUri: 'R' },
			claims: {},
		});
		writeEnv(tmp, 'ui-bad/.env', 'C=c\nR=https://r/cb\n');

		makePortal(tmp, 'ui-good', {
			name: 'good',
			clientId: 'gc',
			redirectUri: 'https://g/cb',
			claims: { sub: 'g' },
		});

		const warnSpy = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		try {
			const portals = discoverPortalConfigs(tmp);
			expect(portals.find((p) => p.name === 'good')).toBeDefined();
			expect(portals.find((p) => p.name === 'bad/name')).toBeUndefined();
			expect(warnSpy).toHaveBeenCalled();
		} finally {
			warnSpy.mockRestore();
		}
	});

	it('skips portal when .env is missing with a warning', () => {
		writeJson(tmp, 'ui-noenv/mock-oidc.json', {
			name: 'noenv',
			envVars: { clientId: 'C', redirectUri: 'R' },
			claims: {},
		});
		// Ensure the directory exists but no .env
		fs.mkdirSync(path.join(tmp, 'ui-noenv'), { recursive: true });

		const warnSpy = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		try {
			const portals = discoverPortalConfigs(tmp);
			expect(portals.length).toBe(0);
			expect(warnSpy).toHaveBeenCalled();
		} finally {
			warnSpy.mockRestore();
		}
	});

	it('skips portal when env var is not present in .env with a warning', () => {
		writeJson(tmp, 'ui-missing-var/mock-oidc.json', {
			name: 'missing-var',
			envVars: { clientId: 'MISSING_VAR', redirectUri: 'R' },
			claims: {},
		});
		writeEnv(tmp, 'ui-missing-var/.env', 'R=https://r/cb\n');

		const warnSpy = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		try {
			const portals = discoverPortalConfigs(tmp);
			expect(portals.length).toBe(0);
			expect(warnSpy).toHaveBeenCalled();
		} finally {
			warnSpy.mockRestore();
		}
	});

	it('skips malformed mock-oidc.json with a warning', () => {
		const p = path.join(tmp, 'ui-malformed');
		fs.mkdirSync(p, { recursive: true });
		fs.writeFileSync(path.join(p, 'mock-oidc.json'), '{ bad json }');

		const warnSpy = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		try {
			const portals = discoverPortalConfigs(tmp);
			expect(portals.length).toBe(0);
			expect(warnSpy).toHaveBeenCalled();
		} finally {
			warnSpy.mockRestore();
		}
	});

	it('silently skips ui-* dirs without mock-oidc.json', () => {
		fs.mkdirSync(path.join(tmp, 'ui-empty'), { recursive: true });

		const portals = discoverPortalConfigs(tmp);
		expect(portals.length).toBe(0);
	});

	it('preserves array and object claim values', () => {
		makePortal(tmp, 'ui-roles', {
			name: 'roles-test',
			clientId: 'cid',
			redirectUri: 'https://r/cb',
			claims: { roles: ['admin', 'editor'], level: 2 },
		});

		const portals = discoverPortalConfigs(tmp);
		expect(portals).toHaveLength(1);
		const portal = portals[0];
		expect(portal).toBeDefined();
		const claims = portal?.claims as
			| { roles?: string[]; level?: number }
			| undefined;
		expect(claims?.roles).toEqual(['admin', 'editor']);
		expect(claims?.level).toBe(2);
	});

	it('prefers .env.local values over .env', () => {
		makePortal(tmp, 'ui-envlocal', {
			name: 'envlocal-test',
			clientId: 'base-client-id',
			redirectUri: 'https://base/cb',
			claims: { sub: 'test' },
		});
		fs.writeFileSync(
			path.join(tmp, 'ui-envlocal', '.env.local'),
			'VITE_CLIENT_ID=local-client-id\n',
		);

		const portals = discoverPortalConfigs(tmp);
		const portal = portals.find((p) => p.name === 'envlocal-test');
		expect(portal).toBeDefined();
		expect(portal?.clientId).toBe('local-client-id');
	});

	it('discovers portal when only .env.local exists and .env does not', () => {
		writeJson(tmp, 'ui-localonly/mock-oidc.json', {
			name: 'localonly-test',
			envVars: { clientId: 'VITE_CLIENT_ID', redirectUri: 'VITE_REDIRECT_URI' },
			claims: { sub: 'lo' },
		});
		fs.writeFileSync(
			path.join(tmp, 'ui-localonly', '.env.local'),
			'VITE_CLIENT_ID=localonly-client-id\nVITE_REDIRECT_URI=https://local/cb\n',
		);

		const portals = discoverPortalConfigs(tmp);
		const portal = portals.find((p) => p.name === 'localonly-test');
		expect(portal).toBeDefined();
		expect(portal?.clientId).toBe('localonly-client-id');
	});

	it('returns empty array and warns for non-existent apps directory', () => {
		const warnSpy = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const nonExistent = `${tmp}-no-such-dir`;
		try {
			const portals = discoverPortalConfigs(nonExistent);
			expect(portals).toEqual([]);
			expect(warnSpy).toHaveBeenCalled();
		} finally {
			warnSpy.mockRestore();
		}
	});
});
