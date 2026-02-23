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
        service = new ServicePaymentCybersource();

  Scenario('Service configObject properties', ({ Given, When, Then }) => {
    Given('a valid ServicePaymentCybersource configuration', () => {
      // ...existing code...
    });
    When('I instantiate the service', () => {
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
});
