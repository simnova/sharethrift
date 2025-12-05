import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { AccountPlanDomainAdapter } from './account-plan.domain-adapter.ts';
import type { Models } from '@sthrift/data-sources-mongoose-models';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
  path.resolve(__dirname, 'features/account-plan.domain-adapter.feature'),
);

function makeAccountPlanDoc(
  overrides: Partial<Models.AccountPlan.AccountPlan> = {},
): Models.AccountPlan.AccountPlan {
  const base = {
    name: 'Pro',
    description: 'Pro plan',
    billingPeriodLength: 12,
    billingPeriodUnit: 'M',
    billingCycles: 1,
    billingAmount: 100,
    currency: 'USD',
    setupFee: 10,
    status: 'ACTIVE',
    cybersourcePlanId: 'cs-123',
    schemaVersion: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    feature: {
      activeReservations: 1,
      bookmarks: 2,
      itemsToShare: 3,
      friends: 4,
    },
    set(key: keyof Models.AccountPlan.AccountPlan, value: unknown) {
      (this as Models.AccountPlan.AccountPlan)[key] = value as never;
    },
    ...overrides,
  } as Models.AccountPlan.AccountPlan;
  return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
  let doc: Models.AccountPlan.AccountPlan;
  let adapter: AccountPlanDomainAdapter;
  let result: unknown;

  BeforeEachScenario(() => {
    doc = makeAccountPlanDoc();
    adapter = new AccountPlanDomainAdapter(doc);
    result = undefined;
  });

  Background(({ Given }) => {
    Given('a valid AccountPlan document', () => {
      doc = makeAccountPlanDoc();
      adapter = new AccountPlanDomainAdapter(doc);
    });
  });

  Scenario('Getting the name property', ({ When, Then }) => {
    When('I get the name property', () => {
      result = adapter.name;
    });
    Then('it should return the correct value', () => {
      expect(result).toBe('Pro');
    });
  });

  Scenario('Setting the name property', ({ When, Then }) => {
    When('I set the name property to "Basic"', () => {
      adapter.name = 'Basic';
    });
    Then("the document's name should be \"Basic\"", () => {
      expect(doc.name).toBe('Basic');
    });
  });

  Scenario('Getting the feature property when present', ({ When, Then }) => {
    When('I get the feature property', () => {
      result = adapter.feature;
    });
    Then('it should return a feature adapter with the correct doc', () => {
      expect(result).toBeDefined();
      expect(doc.feature).toBeDefined();
    });
  });

  Scenario('Getting the feature property when missing', ({ Given, When, Then }) => {
    Given('the feature property is missing', () => {
      doc = makeAccountPlanDoc({});
      // Remove the feature property to simulate missing
      // biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation for index signatures
      delete (doc as unknown as Record<string, unknown>)["feature"];
      adapter = new AccountPlanDomainAdapter(doc);
    });
    When('I get the feature property', () => {
      result = adapter.feature;
    });
    Then('it should create and return a feature adapter', () => {
      expect(result).toBeDefined();
      expect(doc.feature).toBeDefined();
    });
  });

  Scenario('Setting the billingAmount property', ({ When, Then }) => {
    When('I set the billingAmount property to 200', () => {
      adapter.billingAmount = 200;
    });
    Then("the document's billingAmount should be 200", () => {
      expect(doc.billingAmount).toBe(200);
    });
  });

  Scenario('Getting the description property', ({ When, Then }) => {
    When('I get the description property', () => {
      result = adapter.description;
    });
    Then('it should return the correct description', () => {
      expect(result).toBe('Pro plan');
    });
  });

  Scenario('Setting the description property', ({ When, Then }) => {
    When('I set the description property to "Starter plan"', () => {
      adapter.description = 'Starter plan';
    });
    Then("the document's description should be \"Starter plan\"", () => {
      expect(doc.description).toBe('Starter plan');
    });
  });

  Scenario('Getting the billingPeriodLength property', ({ When, Then }) => {
    When('I get the billingPeriodLength property', () => {
      result = adapter.billingPeriodLength;
    });
    Then('it should return the correct billingPeriodLength', () => {
      expect(result).toBe(12);
    });
  });

  Scenario('Setting the billingPeriodLength property', ({ When, Then }) => {
    When('I set the billingPeriodLength property to 6', () => {
      adapter.billingPeriodLength = 6;
    });
    Then("the document's billingPeriodLength should be 6", () => {
      expect(doc.billingPeriodLength).toBe(6);
    });
  });

  Scenario('Getting the billingPeriodUnit property', ({ When, Then }) => {
    When('I get the billingPeriodUnit property', () => {
      result = adapter.billingPeriodUnit;
    });
    Then('it should return the correct billingPeriodUnit', () => {
      expect(result).toBe('M');
    });
  });

  Scenario('Setting the billingPeriodUnit property', ({ When, Then }) => {
    When('I set the billingPeriodUnit property to "Y"', () => {
      adapter.billingPeriodUnit = 'Y';
    });
    Then("the document's billingPeriodUnit should be \"Y\"", () => {
      expect(doc.billingPeriodUnit).toBe('Y');
    });
  });

  Scenario('Getting the billingCycles property', ({ When, Then }) => {
    When('I get the billingCycles property', () => {
      result = adapter.billingCycles;
    });
    Then('it should return the correct billingCycles', () => {
      expect(result).toBe(1);
    });
  });

  Scenario('Setting the billingCycles property', ({ When, Then }) => {
    When('I set the billingCycles property to 3', () => {
      adapter.billingCycles = 3;
    });
    Then("the document's billingCycles should be 3", () => {
      expect(doc.billingCycles).toBe(3);
    });
  });

  Scenario('Getting the currency property', ({ When, Then }) => {
    When('I get the currency property', () => {
      result = adapter.currency;
    });
    Then('it should return the correct currency', () => {
      expect(result).toBe('USD');
    });
  });

  Scenario('Setting the currency property', ({ When, Then }) => {
    When('I set the currency property to "EUR"', () => {
      adapter.currency = 'EUR';
    });
    Then("the document's currency should be \"EUR\"", () => {
      expect(doc.currency).toBe('EUR');
    });
  });

  Scenario('Getting the setupFee property', ({ When, Then }) => {
    When('I get the setupFee property', () => {
      result = adapter.setupFee;
    });
    Then('it should return the correct setupFee', () => {
      expect(result).toBe(10);
    });
  });

  Scenario('Setting the setupFee property', ({ When, Then }) => {
    When('I set the setupFee property to 20', () => {
      adapter.setupFee = 20;
    });
    Then("the document's setupFee should be 20", () => {
      expect(doc.setupFee).toBe(20);
    });
  });

  Scenario('Getting the status property', ({ When, Then }) => {
    When('I get the status property', () => {
      result = adapter.status;
    });
    Then('it should return the correct status', () => {
      expect(result).toBe('ACTIVE');
    });
  });

  Scenario('Setting the status property', ({ When, Then }) => {
    When('I set the status property to "INACTIVE"', () => {
      adapter.status = 'INACTIVE';
    });
    Then("the document's status should be \"INACTIVE\"", () => {
      expect(doc.status).toBe('INACTIVE');
    });
  });

  Scenario('Getting the cybersourcePlanId property', ({ When, Then }) => {
    When('I get the cybersourcePlanId property', () => {
      result = adapter.cybersourcePlanId;
    });
    Then('it should return the correct cybersourcePlanId', () => {
      expect(result).toBe('cs-123');
    });
  });

  Scenario('Setting the cybersourcePlanId property', ({ When, Then }) => {
    When('I set the cybersourcePlanId property to "cs-999"', () => {
      adapter.cybersourcePlanId = 'cs-999';
    });
    Then("the document's cybersourcePlanId should be \"cs-999\"", () => {
      expect(doc.cybersourcePlanId).toBe('cs-999');
    });
  });

  // Feature adapter property scenarios
  Scenario('Getting the activeReservations property', ({ When, Then }) => {
    When('I get the activeReservations property from the feature adapter', () => {
      const featureAdapter = adapter.feature;
      result = featureAdapter.activeReservations;
    });
    Then('it should return the correct activeReservations', () => {
      expect(result).toBe(1);
    });
  });

  Scenario('Setting the activeReservations property', ({ When, Then }) => {
    When('I set the activeReservations property to 10 in the feature adapter', () => {
      const featureAdapter = adapter.feature;
      featureAdapter.activeReservations = 10;
    });
    Then("the feature's activeReservations should be 10", () => {
      expect(doc.feature.activeReservations).toBe(10);
    });
  });

  Scenario('Getting the bookmarks property', ({ When, Then }) => {
    When('I get the bookmarks property from the feature adapter', () => {
      const featureAdapter = adapter.feature;
      result = featureAdapter.bookmarks;
    });
    Then('it should return the correct bookmarks', () => {
      expect(result).toBe(2);
    });
  });

  Scenario('Setting the bookmarks property', ({ When, Then }) => {
    When('I set the bookmarks property to 20 in the feature adapter', () => {
      const featureAdapter = adapter.feature;
      featureAdapter.bookmarks = 20;
    });
    Then("the feature's bookmarks should be 20", () => {
      expect(doc.feature.bookmarks).toBe(20);
    });
  });

  Scenario('Getting the itemsToShare property', ({ When, Then }) => {
    When('I get the itemsToShare property from the feature adapter', () => {
      const featureAdapter = adapter.feature;
      result = featureAdapter.itemsToShare;
    });
    Then('it should return the correct itemsToShare', () => {
      expect(result).toBe(3);
    });
  });

  Scenario('Setting the itemsToShare property', ({ When, Then }) => {
    When('I set the itemsToShare property to 30 in the feature adapter', () => {
      const featureAdapter = adapter.feature;
      featureAdapter.itemsToShare = 30;
    });
    Then("the feature's itemsToShare should be 30", () => {
      expect(doc.feature.itemsToShare).toBe(30);
    });
  });

  Scenario('Getting the friends property', ({ When, Then }) => {
    When('I get the friends property from the feature adapter', () => {
      const featureAdapter = adapter.feature;
      result = featureAdapter.friends;
    });
    Then('it should return the correct friends', () => {
      expect(result).toBe(4);
    });
  });

  Scenario('Setting the friends property', ({ When, Then }) => {
    When('I set the friends property to 40 in the feature adapter', () => {
      const featureAdapter = adapter.feature;
      featureAdapter.friends = 40;
    });
    Then("the feature's friends should be 40", () => {
      expect(doc.feature.friends).toBe(40);
    });
  });
});