import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PaymentServiceCybersource } from './index.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'payment-service-cybersource.feature'));

describeFeature(feature, ({ Scenario, BeforeEachScenario }) => {
  let service: PaymentServiceCybersource;
  let error: unknown;

  BeforeEachScenario(() => {
    service = undefined as unknown as PaymentServiceCybersource;
    error = undefined;
  });

  Scenario('Instantiating with valid config', ({ Given, When, Then }) => {
    Given('a valid PaymentServiceCybersource configuration', () => {
      // ...existing code...
    });
    When('I instantiate the service', () => {
      service = new PaymentServiceCybersource(
        'app', 'merchant', 'keyId', 'keySecret', 'env', 'true', 'origin'
      );
    });
    Then('the service should be an instance of PaymentServiceCybersource', () => {
      expect(service).toBeInstanceOf(PaymentServiceCybersource);
    });
  });

  Scenario('Instantiating with missing config', ({ Given, When, Then }) => {
    Given('an invalid PaymentServiceCybersource configuration', () => {
      // ...existing code...
    });
    When('I instantiate the service', () => {
      try {
        service = new PaymentServiceCybersource();
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown', () => {
      expect(error).toBeDefined();
    });
  });

  Scenario('Service configObject properties', ({ Given, When, Then }) => {
    Given('a valid PaymentServiceCybersource configuration', () => {
      // ...existing code...
    });
    When('I instantiate the service', () => {
      service = new PaymentServiceCybersource(
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
});
