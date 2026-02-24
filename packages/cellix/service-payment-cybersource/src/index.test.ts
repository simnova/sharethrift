import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { ServicePaymentCybersource } from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'payment-service-cybersource.feature'));

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
  let service: ServicePaymentCybersource;
  let error: unknown;

  BeforeEachScenario(() => {
    service = undefined as unknown as ServicePaymentCybersource;
    error = undefined;
  });

  Scenario('Instantiating with valid config', ({ Given, When, Then }) => {
    Given('a valid ServicePaymentCybersource configuration', () => {
      // ...existing code...
    });
    When('I instantiate the service', () => {
      // biome-ignore lint/complexity/useLiteralKeys: Required for env var access
      service = new ServicePaymentCybersource(
        'app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin'
      );
    });
    Then('the service should be an instance of ServicePaymentCybersource', () => {
      expect(service).toBeInstanceOf(ServicePaymentCybersource);
    });
  });

  Scenario('Instantiating with missing config', ({ Given, When, Then }) => {
    Given('an invalid ServicePaymentCybersource configuration', () => {
      // ...existing code...
    });
    When('I instantiate the service', () => {
      try {
        // biome-ignore lint/complexity/useLiteralKeys: Required for env var access
        service = new ServicePaymentCybersource();
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown', () => {
      expect(error).toBeDefined();
    });
  });

  Scenario('Service configObject properties', ({ Given, When, Then }) => {
    Given('a valid ServicePaymentCybersource configuration', () => {
      // ...existing code...
    });
    When('I instantiate the service', () => {
      // biome-ignore lint/complexity/useLiteralKeys: Required for env var access
      service = new ServicePaymentCybersource(
        'app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin'
      );
    });
    Then('the configObject should have correct properties', () => {
      expect(service['configObject']).toMatchObject({
        authenticationType: 'http_signature',
        runEnvironment: 'env',
        merchantID: 'merchant',
        merchantKeyId: 'keyId',
        merchantsecretKey: 'keySecret',
        logConfiguration: { enableLog: 'true' },
      });
    });
  });

  Scenario('startUp and shutDown methods', ({ When, Then }) => {
    When('I call startUp and shutDown', async () => {
      // biome-ignore lint/complexity/useLiteralKeys: Required for env var access
      service = new ServicePaymentCybersource('app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin');
      await service.startUp();
      await service.shutDown();
    });
    Then('service.client should be undefined after shutDown', () => {
      expect(service['client']).toBeUndefined();
    });
  });

  Scenario('startUp throws if already started', ({ When, Then }) => {
    When('I call startUp twice', async () => {
      // biome-ignore lint/complexity/useLiteralKeys: Required for env var access
      service = new ServicePaymentCybersource('app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin');
      await service.startUp();
      try {
        await service.startUp();
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown', () => {
      expect(error).toBeDefined();
      // biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
      expect((error as any).message).toMatch(/already started/);
    });
  });

  Scenario('service getter throws if not started', ({ When, Then }) => {
    When('I access service before startUp', () => {
      // biome-ignore lint/complexity/useLiteralKeys: Required for env var access
      service = new ServicePaymentCybersource('app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin');
      try {
        // Should throw
        // biome-ignore lint/suspicious/noExplicitAny: test private getter
        (service as any).service;
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown', () => {
      expect(error).toBeDefined();
      // biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
      expect((error as any).message).toMatch(/not started/);
    });
  });

  Scenario('createPlan throws not implemented', ({ When, Then }) => {
    When('I call createPlan', async () => {
      // biome-ignore lint/complexity/useLiteralKeys: Required for env var access
      service = new ServicePaymentCybersource('app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin');
      try {
        await service.createPlan({} as any);
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown', () => {
      expect(error).toBeDefined();
      // biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
      expect((error as any).message).toMatch(/not implemented/);
    });
  });

  Scenario('listOfPlans throws not implemented', ({ When, Then }) => {
    When('I call listOfPlans', async () => {
      // biome-ignore lint/complexity/useLiteralKeys: Required for env var access
      service = new ServicePaymentCybersource('app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin');
      try {
        await service.listOfPlans();
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown', () => {
      expect(error).toBeDefined();
      // biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
      expect((error as any).message).toMatch(/not implemented/);
    });
  });

  Scenario('getPlan throws not implemented', ({ When, Then }) => {
    When('I call getPlan', async () => {
      // biome-ignore lint/complexity/useLiteralKeys: Required for env var access
      service = new ServicePaymentCybersource('app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin');
      try {
        await service.getPlan('planId');
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown', () => {
      expect(error).toBeDefined();
      // biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
      expect((error as any).message).toMatch(/not implemented/);
    });
  });

  Scenario('createSubscription throws not implemented', ({ When, Then }) => {
    When('I call createSubscription', async () => {
      // biome-ignore lint/complexity/useLiteralKeys: Required for env var access
      service = new ServicePaymentCybersource('app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin');
      try {
        await service.createSubscription({} as any);
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown', () => {
      expect(error).toBeDefined();
      // biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
      expect((error as any).message).toMatch(/not implemented/);
    });
  });

  Scenario('updatePlanForSubscription throws not implemented', ({ When, Then }) => {
    When('I call updatePlanForSubscription', async () => {
      // biome-ignore lint/complexity/useLiteralKeys: Required for env var access
      service = new ServicePaymentCybersource('app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin');
      try {
        await service.updatePlanForSubscription('subId', 'planId');
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown', () => {
      expect(error).toBeDefined();
      // biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
      expect((error as any).message).toMatch(/not implemented/);
    });
  });

  Scenario('listOfSubscriptions throws not implemented', ({ When, Then }) => {
    When('I call listOfSubscriptions', async () => {
      service = new ServicePaymentCybersource('app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin');
      try {
        await service.listOfSubscriptions();
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown', () => {
      expect(error).toBeDefined();
      // biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
      expect((error as any).message).toMatch(/not implemented/);
    });
  });

  Scenario('suspendSubscription throws not implemented', ({ When, Then }) => {
    When('I call suspendSubscription', async () => {
      service = new ServicePaymentCybersource('app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin');
      try {
        await service.suspendSubscription('subId');
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown', () => {
      expect(error).toBeDefined();
      // biome-ignore lint/suspicious/noExplicitAny: error type assertion for test
      expect((error as any).message).toMatch(/not implemented/);
    });
  });

});
