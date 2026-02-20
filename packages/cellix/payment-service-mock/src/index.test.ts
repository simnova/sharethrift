import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PaymentServiceMock } from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
  let service: PaymentServiceMock;
  let error: unknown;
  let result: unknown;

  BeforeEachScenario(() => {
    service = undefined as unknown as PaymentServiceMock;
    error = undefined;
    result = undefined;
  });

  Scenario('Instantiating with baseUrl', ({ Given, When, Then, And }) => {
    Given('a PaymentServiceMock with baseUrl "http://localhost:3001"', () => {
    });
    When('I instantiate the service', () => {
      service = new PaymentServiceMock('http://localhost:3001');
    });
    Then('the service should be an instance of PaymentServiceMock', () => {
      expect(service).toBeInstanceOf(PaymentServiceMock);
    });
    And('the mockBaseUrl should be "http://localhost:3001"', () => {
      expect(service['mockBaseUrl']).toBe('http://localhost:3001');
    });
  });

  Scenario('Starting up the service', ({ Given, When, Then, And }) => {
    Given('a PaymentServiceMock', () => {
      service = new PaymentServiceMock('http://localhost:3001');
    });
    When('I start up the service', async () => {
      result = await service.startUp();
    });
    Then('it should return itself', () => {
      expect(result).toBe(service);
    });
    And('the http property should be defined', () => {
      expect(service['http']).toBeDefined();
    });
  });

  Scenario('Starting up twice throws', ({ Given, When, Then }) => {
    Given('a PaymentServiceMock', () => {
      service = new PaymentServiceMock('http://localhost:3001');
    });
    When('I start up the service twice', async () => {
      await service.startUp();
      try {
        await service.startUp();
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown indicating already started', () => {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/already started/);
    });
  });

  Scenario('Shutting down after start', ({ Given, When, Then }) => {
    Given('a PaymentServiceMock', () => {
      service = new PaymentServiceMock('http://localhost:3001');
    });
    When('I start up and then shut down the service', async () => {
      await service.startUp();
      await service.shutDown();
    });
    Then('the http property should be undefined', () => {
      expect(service['http']).toBeUndefined();
    });
  });

  Scenario('Shutting down before start throws', ({ Given, When, Then }) => {
    Given('a PaymentServiceMock', () => {
      service = new PaymentServiceMock('http://localhost:3001');
    });
    When('I shut down before starting up', async () => {
      try {
        await service.shutDown();
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown indicating not started', () => {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/not started/);
    });
  });

  Scenario('Accessing service before start throws', ({ Given, When, Then }) => {
    Given('a PaymentServiceMock', () => {
      service = new PaymentServiceMock('http://localhost:3001');
    });
    When('I access the service getter before starting up', () => {
      try {
        result = service.service;
      } catch (e) {
        error = e;
      }
    });
    Then('an error should be thrown indicating not started', () => {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/not started/);
    });
  });

  Scenario('Accessing service after start', ({ Given, When, Then }) => {
    Given('a PaymentServiceMock', () => {
      service = new PaymentServiceMock('http://localhost:3001');
    });
    When('I start up the service', async () => {
      await service.startUp();
    });
    Then('the service getter should return the http instance', () => {
      expect(service.service).toBeDefined();
    });
  });
});