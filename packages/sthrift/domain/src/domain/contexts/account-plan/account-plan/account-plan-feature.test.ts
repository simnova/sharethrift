type AccountPlanFeatureProps = {
  activeReservations: number;
  bookmarks: number;
  itemsToShare: number;
  friends: number;
};
const _noPermVisa = {
  determineIf: (fn: (p: { canCreateAccountPlan: boolean; canUpdateAccountPlan: boolean; canDeleteAccountPlan: boolean }) => boolean) =>
    fn({ canCreateAccountPlan: false, canUpdateAccountPlan: false, canDeleteAccountPlan: false }),
} as const;
// The negative-permission scenario is now moved inside the test.for block below
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AccountPlanFeature } from './account-plan-feature.ts';

const _mockVisa = {
  determineIf: (fn: (p: { canCreateAccountPlan: boolean; canUpdateAccountPlan: boolean; canDeleteAccountPlan: boolean }) => boolean) =>
    fn({ canCreateAccountPlan: true, canUpdateAccountPlan: true, canDeleteAccountPlan: true }),
} as const;

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
  path.resolve(__dirname, 'features/account-plan-feature.feature'),
);

function makeBaseProps(overrides: Partial<AccountPlanFeatureProps> = {}): AccountPlanFeatureProps {
  return {
    activeReservations: 1,
    bookmarks: 2,
    itemsToShare: 3,
    friends: 4,
    ...overrides,
  };
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
  let baseProps: AccountPlanFeatureProps;
  let featureObj: AccountPlanFeature;
  let noPermFeature: AccountPlanFeature;

  BeforeEachScenario(() => {
    baseProps = makeBaseProps();
    featureObj = new AccountPlanFeature(baseProps, _mockVisa);
  noPermFeature = undefined as unknown as AccountPlanFeature;
  });

  Background(({ Given }) => {
    Given('base account plan feature properties', () => {
      baseProps = makeBaseProps();
      featureObj = new AccountPlanFeature(baseProps, _mockVisa);
    });
  });

  Scenario('Creating a new AccountPlanFeature instance', ({ When, Then }) => {
    When('I create a new AccountPlanFeature', () => {
      featureObj = new AccountPlanFeature(makeBaseProps(), _mockVisa);
    });
    Then('it should have correct activeReservations', () => {
      expect(featureObj.activeReservations).toBe(1);
    });
    Then('it should have correct bookmarks', () => {
      expect(featureObj.bookmarks).toBe(2);
    });
    Then('it should have correct itemsToShare', () => {
      expect(featureObj.itemsToShare).toBe(3);
    });
    Then('it should have correct friends', () => {
      expect(featureObj.friends).toBe(4);
    });
  });

  Scenario('Updating feature properties', ({ When, Then }) => {
    When('I set activeReservations to 10', () => {
      featureObj.activeReservations = 10;
    });
    Then('activeReservations should be 10', () => {
      expect(featureObj.activeReservations).toBe(10);
    });
    When('I set bookmarks to 20', () => {
      featureObj.bookmarks = 20;
    });
    Then('bookmarks should be 20', () => {
      expect(featureObj.bookmarks).toBe(20);
    });
    When('I set itemsToShare to 30', () => {
      featureObj.itemsToShare = 30;
    });
    Then('itemsToShare should be 30', () => {
      expect(featureObj.itemsToShare).toBe(30);
    });
    When('I set friends to 40', () => {
      featureObj.friends = 40;
    });
    Then('friends should be 40', () => {
      expect(featureObj.friends).toBe(40);
    });
  });

  Scenario('Getting all properties', ({ Then }) => {
    Then('all properties should return correct values', () => {
      expect(featureObj.activeReservations).toBe(1);
      expect(featureObj.bookmarks).toBe(2);
      expect(featureObj.itemsToShare).toBe(3);
      expect(featureObj.friends).toBe(4);
    });
  });

  Scenario('Setting properties without permission throws', ({ Given, When, Then }) => {
    Given('an AccountPlanFeature with no permissions', () => {
      noPermFeature = new AccountPlanFeature(makeBaseProps(), _noPermVisa);
    });
    When('I attempt to set activeReservations', () => {
      // do nothing, test in Then
    });
    Then('it should throw a PermissionError for activeReservations', () => {
      expect(() => {
        noPermFeature.activeReservations = 99;
      }).toThrow();
    });
    When('I attempt to set bookmarks', () => {
      // do nothing, test in Then
    });
    Then('it should throw a PermissionError for bookmarks', () => {
      expect(() => {
        noPermFeature.bookmarks = 99;
      }).toThrow();
    });
    When('I attempt to set itemsToShare', () => {
      // do nothing, test in Then
    });
    Then('it should throw a PermissionError for itemsToShare', () => {
      expect(() => {
        noPermFeature.itemsToShare = 99;
      }).toThrow();
    });
    When('I attempt to set friends', () => {
      // do nothing, test in Then
    });
    Then('it should throw a PermissionError for friends', () => {
      expect(() => {
        noPermFeature.friends = 99;
      }).toThrow();
    });
  });
});
