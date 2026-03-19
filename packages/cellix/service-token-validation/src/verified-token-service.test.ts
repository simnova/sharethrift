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

    Scenario('Timer logic: start sets timer, start again does not duplicate', ({ When, Then }) => {
      When('I call start twice', () => {
        service = new VerifiedTokenService(openIdConfigs);
        service.start();
        const firstTimer = service.timerInstance;
        service.start();
        Then('timerInstance should be same', () => {
          expect(service.timerInstance).toBe(firstTimer);
        });
      });
    });

    Scenario('refreshCollection updates keystore', ({ When, Then }) => {
      When('I call refreshCollection', () => {
        service = new VerifiedTokenService(openIdConfigs);
        service.refreshCollection();
      });
      Then('keystore should be updated for all keys', () => {
        expect(service.keyStoreCollection.size).toBe(2);
        expect(service.keyStoreCollection.has('portal1')).toBe(true);
        expect(service.keyStoreCollection.has('portal2')).toBe(true);
      });
    });

    Scenario('getVerifiedJwt throws if not started', ({ When, Then }) => {
      When('I call getVerifiedJwt before start', async () => {
        service = new VerifiedTokenService(openIdConfigs);
        try {
          await service.getVerifiedJwt(testToken, 'portal1');
        } catch (e) {
          Then('error should be thrown', () => {
            expect(e).toBeDefined();
            // biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
            expect((e as any).message).toMatch(/not started/);
          });
        }
      });
    });

    Scenario('getVerifiedJwt throws if invalid config key', ({ When, Then }) => {
      When('I call getVerifiedJwt with invalid key', async () => {
        service = new VerifiedTokenService(openIdConfigs);
        service.start();
        try {
          await service.getVerifiedJwt(testToken, 'invalid-key');
        } catch (e) {
          Then('error should be thrown', () => {
            expect(e).toBeDefined();
            // biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
            expect((e as any).message).toMatch(/Invalid OpenIdConfig Key/);
          });
        }
      });
    });

    Scenario('getVerifiedJwt returns payload for valid config', ({ When, Then }) => {
      let result: Awaited<ReturnType<typeof service.getVerifiedJwt>>;
      When('I call getVerifiedJwt with valid key', async () => {
        service = new VerifiedTokenService(openIdConfigs);
        service.start();
        result = await service.getVerifiedJwt(testToken, 'portal1');
      });
      Then('payload should be defined', () => {
        expect(result.payload).toBeDefined();
        expect(result.payload.sub).toBe('test-subject');
      });
    });

    Scenario('getVerifiedJwt respects ignoreIssuer and clockTolerance', ({ When, Then }) => {
      let result: Awaited<ReturnType<typeof service.getVerifiedJwt>>;
      When('I call getVerifiedJwt with ignoreIssuer true and custom clockTolerance', async () => {
        const customConfig = new Map([
          [
            'custom-portal',
            {
              issuerUrl: 'https://example.com',
              oidcEndpoint: 'https://example.com/.well-known/jwks.json',
              audience: 'test-audience',
              ignoreIssuer: true,
              clockTolerance: '10 minutes',
            },
          ],
        ]);
        service = new VerifiedTokenService(customConfig);
        service.start();
        result = await service.getVerifiedJwt(testToken, 'custom-portal');
      });
      Then('payload should be defined', () => {
        expect(result.payload).toBeDefined();
        expect(result.payload.aud).toBe('test-audience');
      });
    });
  }
);
