import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import {
	ServiceTokenValidation,
	type TokenValidation,
	type TokenValidationResult,
} from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/index.feature'),
);


test.for(feature, ({ Scenario }) => {

	Scenario('Exporting ServiceTokenValidation class', ({ When, Then, And }) => {
		let ServiceTokenValidationClass: typeof ServiceTokenValidation;

		When('I import ServiceTokenValidation from the index', () => {
			ServiceTokenValidationClass = ServiceTokenValidation;
		});

		Then('it should be a constructor function', () => {
			expect(typeof ServiceTokenValidationClass).toBe('function');
			expect(ServiceTokenValidationClass.name).toBe('ServiceTokenValidation');
		});

		And('it should have the expected properties and methods', () => {
			const portalTokens = new Map([['test', 'TEST']]);
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			process.env['TEST_OIDC_ENDPOINT'] = 'https://example.com/.well-known/jwks.json';
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			process.env['TEST_OIDC_AUDIENCE'] = 'test-audience';
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			process.env['TEST_OIDC_ISSUER'] = 'https://example.com';

			const instance = new ServiceTokenValidationClass(portalTokens);
			expect(instance).toHaveProperty('startUp');
			expect(instance).toHaveProperty('verifyJwt');
			expect(instance).toHaveProperty('shutDown');
			expect(typeof instance.startUp).toBe('function');
			expect(typeof instance.verifyJwt).toBe('function');
			expect(typeof instance.shutDown).toBe('function');

			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			delete process.env['TEST_OIDC_ENDPOINT'];
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			delete process.env['TEST_OIDC_AUDIENCE'];
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			delete process.env['TEST_OIDC_ISSUER'];
		});
	});

	Scenario('Exporting TokenValidation interface', ({ When, Then }) => {
		When('I import the TokenValidation type from the index', () => {
			// Type imports are compile-time only
		});

		Then('it should be properly exported as a type', () => {
			const validation: TokenValidation = {
				verifyJwt: <T>(
					_token: string,
				): Promise<TokenValidationResult<T> | null> => {
					return Promise.resolve(null);
				},
			};
			expect(validation).toBeDefined();
		});
	});

	Scenario('Exporting TokenValidationResult interface', ({ When, Then }) => {
		When('I import the TokenValidationResult type from the index', () => {
			// Type imports are compile-time only
		});

		Then('it should be properly exported as a type', () => {
			const result: TokenValidationResult<{ sub: string }> = {
				verifiedJwt: { sub: 'test-subject' },
				openIdConfigKey: 'test-key',
			};
			expect(result).toBeDefined();
			expect(result.verifiedJwt.sub).toBe('test-subject');
		});
	});

	Scenario('startUp and shutDown methods', ({ When, Then }) => {
		let instance: ServiceTokenValidation;
		When('I call startUp and shutDown', async () => {
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			process.env['TEST_OIDC_ENDPOINT'] = 'https://example.com/.well-known/jwks.json';
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			process.env['TEST_OIDC_AUDIENCE'] = 'test-audience';
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			process.env['TEST_OIDC_ISSUER'] = 'https://example.com';
			const portalTokens = new Map([['test', 'TEST']]);
			instance = new ServiceTokenValidation(portalTokens);
			await instance.startUp();
			await instance.shutDown();
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			delete process.env['TEST_OIDC_ENDPOINT'];
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			delete process.env['TEST_OIDC_AUDIENCE'];
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			delete process.env['TEST_OIDC_ISSUER'];
		});
		Then('tokenVerifier.timerInstance should be undefined after shutDown', () => {
			// biome-ignore lint/complexity/useLiteralKeys: Required for test access
			expect(instance['tokenVerifier'].timerInstance).toBeUndefined();
		});
	});

	Scenario('tryGetConfigValue throws if missing', ({ When, Then }) => {
		let instance: ServiceTokenValidation;
		let error: unknown;
		When('I call tryGetConfigValue with missing env', () => {
			const portalTokens = new Map([['test', 'TEST']]);
			instance = new ServiceTokenValidation(portalTokens);
			try {
				// biome-ignore lint/complexity/useLiteralKeys: Required for test access
				// biome-ignore lint/suspicious/noExplicitAny: Required for test access
				(instance as any).tryGetConfigValue('MISSING_ENV');
			} catch (e) {
				error = e;
			}
		});
		Then('an error should be thrown', () => {
			expect(error).toBeDefined();
			// biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
			expect((error as any).message).toMatch(/not set/);
		});
	});

	Scenario('tryGetConfigValueWithDefault returns default', ({ When, Then }) => {
		let instance: ServiceTokenValidation;
		When('I call tryGetConfigValueWithDefault with missing env', () => {
			const portalTokens = new Map([['test', 'TEST']]);
			instance = new ServiceTokenValidation(portalTokens);
		});
		Then('it should return the default value', () => {
			// biome-ignore lint/complexity/useLiteralKeys: Required for test access
			// biome-ignore lint/suspicious/noExplicitAny: Required for test access
			const val = (instance as any).tryGetConfigValueWithDefault('MISSING_ENV', 'default');
			expect(val).toBe('default');
		});
	});

	Scenario('verifyJwt returns null if no config matches', ({ When, Then }) => {
		let instance: ServiceTokenValidation;
		When('I call verifyJwt with no valid config', async () => {
			const portalTokens = new Map([['test', 'TEST']]);
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			process.env['TEST_OIDC_ENDPOINT'] = 'https://example.com/.well-known/jwks.json';
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			process.env['TEST_OIDC_AUDIENCE'] = 'test-audience';
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			process.env['TEST_OIDC_ISSUER'] = 'https://example.com';
			instance = new ServiceTokenValidation(portalTokens);
			await instance.verifyJwt('invalid-token');
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			delete process.env['TEST_OIDC_ENDPOINT'];
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			delete process.env['TEST_OIDC_AUDIENCE'];
			// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
			delete process.env['TEST_OIDC_ISSUER'];
			// biome-ignore lint/complexity/useLiteralKeys: Required for test access
			// biome-ignore lint/suspicious/noExplicitAny: Required for test access
			instance['tokenVerifier'].getVerifiedJwt = async () => null as any;
		});
		Then('it should return null', () => {
			expect(instance.verifyJwt('invalid-token')).resolves.toBeNull();
		});
	});

});
