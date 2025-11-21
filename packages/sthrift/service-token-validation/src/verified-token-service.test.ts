import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import {
	type OpenIdConfig,
	VerifiedTokenService,
} from './verified-token-service.ts';

vi.mock('jose', () => ({
	createRemoteJWKSet: vi.fn((_url: URL) => {
		return vi.fn(() => Promise.resolve({ kid: 'test-key', alg: 'RS256' }));
	}),
	jwtVerify: vi.fn(
		(_token: string, _keyFunc: unknown, _options: unknown) => {
			return Promise.resolve({
				payload: {
					sub: 'test-subject',
					aud: 'test-audience',
					iss: 'https://example.com',
					exp: Math.floor(Date.now() / 1000) + 3600,
				},
				protectedHeader: {
					alg: 'RS256',
					kid: 'test-key',
				},
			});
		},
	),
}));

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/verified-token-service.feature'),
);

test.for(
	feature,
	({ Scenario, BeforeEachScenario, AfterEachScenario }) => {
		let openIdConfigs: Map<string, OpenIdConfig>;
		let service: VerifiedTokenService;
		let testToken: string;

		BeforeEachScenario(() => {
			openIdConfigs = new Map([
				[
					'portal1',
					{
						issuerUrl: 'https://example.com',
						oidcEndpoint: 'https://example.com/.well-known/jwks.json',
						audience: 'test-audience',
						ignoreIssuer: false,
						clockTolerance: '5 minutes',
					},
				],
				[
					'portal2',
					{
						issuerUrl: 'https://another.com',
						oidcEndpoint: 'https://another.com/.well-known/jwks.json',
						audience: ['aud1', 'aud2'],
						ignoreIssuer: true,
					},
				],
			]);
			testToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.test.signature';
			vi.clearAllTimers();
			vi.useFakeTimers();
			vi.clearAllTimers();
			vi.useFakeTimers();
		});

		AfterEachScenario(() => {
			if (service?.timerInstance) {
				clearInterval(service.timerInstance);
			}
			vi.useRealTimers();
		});

		Scenario(
			'Constructing VerifiedTokenService with valid configurations',
			({ Given, When, Then, And }) => {
				Given('a valid OpenID config map', () => {
					// Already set in Background
				});

				When('the VerifiedTokenService is constructed', () => {
					service = new VerifiedTokenService(openIdConfigs);
				});

				Then('it should initialize with the provided configurations', () => {
					expect(service.openIdConfigs).toBe(openIdConfigs);
					expect(service.refreshInterval).toBe(1000 * 60 * 5);
				});

				And('the keystore collection should be empty initially', () => {
					expect(service.keyStoreCollection.size).toBe(0);
				});
			},
		);

		Scenario(
			'Constructing VerifiedTokenService without configurations',
			({ Given, When, Then }) => {
				Given('a null OpenID config map', () => {
					// Will be null in the constructor call
				});

				When('the VerifiedTokenService is constructed', () => {
					// Handled in Then
				});

				Then(
					'it should throw an error indicating configurations are required',
					() => {
						expect(
							() =>
								new VerifiedTokenService(
									null as unknown as Map<string, OpenIdConfig>,
								),
						).toThrow('openIdConfigs is required');
					},
				);
			},
		);

		Scenario(
			'Starting the service to refresh keystores',
			({ Given, When, Then, And }) => {
				Given(
					'a VerifiedTokenService instance with valid configurations',
					() => {
						service = new VerifiedTokenService(openIdConfigs);
					},
				);

				When('the start method is called', () => {
					service.start();
				});

				Then('it should immediately refresh the keystore collection', () => {
					expect(service.keyStoreCollection.size).toBe(2);
					expect(service.keyStoreCollection.has('portal1')).toBe(true);
					expect(service.keyStoreCollection.has('portal2')).toBe(true);
				});

				And(
					'it should set up a timer to refresh keystores periodically',
					() => {
						expect(service.timerInstance).toBeDefined();
					},
				);
			},
		);

		Scenario('Starting the service multiple times', ({ Given, When, Then }) => {
			Given('a VerifiedTokenService instance that has been started', () => {
				service = new VerifiedTokenService(openIdConfigs);
				service.start();
			});

			When('the start method is called again', () => {
				const firstTimer = service.timerInstance;
				service.start();
				expect(service.timerInstance).toBe(firstTimer);
			});

			Then('it should not create multiple timer instances', () => {
				expect(service.timerInstance).toBeDefined();
			});
		});

		Scenario(
			'Refreshing the keystore collection',
			({ Given, When, Then, And }) => {
				Given(
					'a VerifiedTokenService instance with valid configurations',
					() => {
						service = new VerifiedTokenService(openIdConfigs);
					},
				);

				When('the refreshCollection method is called', () => {
					service.refreshCollection();
				});

				Then('it should create keystores for each OpenID configuration', () => {
					expect(service.keyStoreCollection.size).toBe(2);
				});

				And(
					'each keystore should be associated with its configuration key',
					() => {
						const portal1Store = service.keyStoreCollection.get('portal1');
						const portal2Store = service.keyStoreCollection.get('portal2');
						expect(portal1Store).toBeDefined();
						expect(portal2Store).toBeDefined();
						expect(portal1Store?.issuerUrl).toBe('https://example.com');
						expect(portal2Store?.issuerUrl).toBe('https://another.com');
					},
				);
			},
		);

		Scenario(
			'Verifying a JWT with a valid token',
			({ Given, And, When, Then }) => {
				let result: Awaited<ReturnType<typeof service.getVerifiedJwt>>;

				Given('a started VerifiedTokenService instance', () => {
					service = new VerifiedTokenService(openIdConfigs);
					service.start();
				});

				And('a valid JWT token', () => {
					// Already set in Background
				});

				When(
					'getVerifiedJwt is called with the token and a valid config key',
					async () => {
						result = await service.getVerifiedJwt(testToken, 'portal1');
					},
				);

				Then('it should return the verified JWT payload', () => {
					expect(result).toBeDefined();
					expect(result.payload).toBeDefined();
				});

				And('the payload should contain the expected claims', () => {
					expect(result.payload.sub).toBe('test-subject');
					expect(result.payload.aud).toBe('test-audience');
				});
			},
		);

		Scenario(
			'Verifying a JWT before service is started',
			({ Given, When, Then }) => {
				Given(
					'a VerifiedTokenService instance that has not been started',
					() => {
						service = new VerifiedTokenService(openIdConfigs);
					},
				);

				When('getVerifiedJwt is called', async () => {
					// Handled in Then
				});

				Then(
					'it should throw an error indicating the service is not started',
					async () => {
						await expect(
							service.getVerifiedJwt(testToken, 'portal1'),
						).rejects.toThrow('ContextUserFromMsal not started');
					},
				);
			},
		);

		Scenario(
			'Verifying a JWT with an invalid config key',
			({ Given, When, Then }) => {
				Given('a started VerifiedTokenService instance', () => {
					service = new VerifiedTokenService(openIdConfigs);
					service.start();
				});

				When(
					'getVerifiedJwt is called with an invalid config key',
					async () => {
						// Handled in Then
					},
				);

				Then(
					'it should throw an error indicating the config key is invalid',
					async () => {
						await expect(
							service.getVerifiedJwt(testToken, 'invalid-key'),
						).rejects.toThrow('Invalid OpenIdConfig Key');
					},
				);
			},
		);

		Scenario(
			'Verifying a JWT with audience validation',
			({ Given, When, Then }) => {
				let result: Awaited<ReturnType<typeof service.getVerifiedJwt>>;

				Given(
					'a started VerifiedTokenService instance with audience configuration',
					() => {
						service = new VerifiedTokenService(openIdConfigs);
						service.start();
					},
				);

				When(
					'getVerifiedJwt is called with a token containing the correct audience',
					async () => {
						result = await service.getVerifiedJwt(testToken, 'portal1');
					},
				);

				Then(
					'it should successfully verify and return the token payload',
					() => {
						expect(result.payload).toBeDefined();
						expect(result.payload.aud).toBe('test-audience');
					},
				);
			},
		);

		Scenario(
			'Verifying a JWT with issuer validation disabled',
			({ Given, When, Then }) => {
				let result: Awaited<ReturnType<typeof service.getVerifiedJwt>>;

				Given(
					'a started VerifiedTokenService instance with ignoreIssuer set to true',
					() => {
						service = new VerifiedTokenService(openIdConfigs);
						service.start();
					},
				);

				When(
					'getVerifiedJwt is called with a token from any issuer',
					async () => {
						result = await service.getVerifiedJwt(testToken, 'portal2');
					},
				);

				Then('it should skip issuer validation and verify the token', () => {
					expect(result.payload).toBeDefined();
				});
			},
		);

		Scenario(
			'Verifying a JWT with custom clock tolerance',
			({ Given, When, Then }) => {
				let result: Awaited<ReturnType<typeof service.getVerifiedJwt>>;
				let customConfig: Map<string, OpenIdConfig>;

				Given(
					'a started VerifiedTokenService instance with custom clock tolerance',
					() => {
						customConfig = new Map([
							[
								'custom-portal',
								{
									issuerUrl: 'https://example.com',
									oidcEndpoint: 'https://example.com/.well-known/jwks.json',
									audience: 'test-audience',
									ignoreIssuer: false,
									clockTolerance: '10 minutes',
								},
							],
						]);
						service = new VerifiedTokenService(customConfig);
						service.start();
					},
				);

				When(
					'getVerifiedJwt is called with a token slightly expired',
					async () => {
						result = await service.getVerifiedJwt(testToken, 'custom-portal');
					},
				);

				Then(
					'it should accept the token within the clock tolerance window',
					() => {
						expect(result.payload).toBeDefined();
					},
				);
			},
		);
	},
);
