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
			// biome-ignore lint/complexity/useLiteralKeys: Required for dynamic env var access
			process.env['TEST_OIDC_ENDPOINT'] =
				'https://example.com/.well-known/jwks.json';
			// biome-ignore lint/complexity/useLiteralKeys: Required for dynamic env var access
			process.env['TEST_OIDC_AUDIENCE'] = 'test-audience';
			// biome-ignore lint/complexity/useLiteralKeys: Required for dynamic env var access
			process.env['TEST_OIDC_ISSUER'] = 'https://example.com';

			const instance = new ServiceTokenValidationClass(portalTokens);
			expect(instance).toHaveProperty('startUp');
			expect(instance).toHaveProperty('verifyJwt');
			expect(instance).toHaveProperty('shutDown');
			expect(typeof instance.startUp).toBe('function');
			expect(typeof instance.verifyJwt).toBe('function');
			expect(typeof instance.shutDown).toBe('function');

			// biome-ignore lint/complexity/useLiteralKeys: Required for dynamic env var access
			delete process.env['TEST_OIDC_ENDPOINT'];
			// biome-ignore lint/complexity/useLiteralKeys: Required for dynamic env var access
			delete process.env['TEST_OIDC_AUDIENCE'];
			// biome-ignore lint/complexity/useLiteralKeys: Required for dynamic env var access
			delete process.env['TEST_OIDC_ISSUER'];
		});
	});

	Scenario('Exporting TokenValidation interface', ({ When, Then }) => {
		When('I import the TokenValidation type from the index', () => {
			// Type imports are compile-time only
		});

		Then('it should be properly exported as a type', () => {
			// Type check: this compiles if TokenValidation is properly exported
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
			// Type check: this compiles if TokenValidationResult is properly exported
			const result: TokenValidationResult<{ sub: string }> = {
				verifiedJwt: { sub: 'test-subject' },
				openIdConfigKey: 'test-key',
			};
			expect(result).toBeDefined();
			expect(result.verifiedJwt.sub).toBe('test-subject');
		});
	});
});
