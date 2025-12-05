import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserAccountProfileBillingSubscription } from './personal-user-account-profile-billing-subscription.ts';
import type { PersonalUserAccountProfileBillingSubscriptionProps } from './personal-user-account-profile-billing-subscription.entity.ts';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-account-profile-billing-subscription.feature'),
);

function makeSubscriptionProps(
	overrides?: Partial<PersonalUserAccountProfileBillingSubscriptionProps>,
): PersonalUserAccountProfileBillingSubscriptionProps {
	return {
		subscriptionId: 'sub-12345',
		planCode: 'premium',
		status: 'ACTIVE',
		startDate: new Date('2024-01-01'),
		...overrides,
	};
}

// biome-ignore lint/suspicious/noExplicitAny: Test mock
function createMockVisa(canEdit: boolean): any {
	return {
		determineIf: (fn: (permissions: { isEditingOwnAccount: boolean }) => boolean) =>
			fn({ isEditingOwnAccount: canEdit }),
	};
}

// biome-ignore lint/suspicious/noExplicitAny: Test mock
function createMockRoot(isNew: boolean): any {
	return { isNew };
}

test.for(feature, ({ Background, Scenario }) => {
	let props: PersonalUserAccountProfileBillingSubscriptionProps;
	let subscription: PersonalUserAccountProfileBillingSubscription;
	let visa: UserVisa;
	let root: PersonalUserAggregateRoot;

	Background(({ Given }) => {
		Given('I have valid billing subscription props', () => {
			props = makeSubscriptionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
		});
	});

	Scenario('Creating a billing subscription instance', ({ When, Then }) => {
		When('I create a PersonalUserAccountProfileBillingSubscription instance', () => {
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		Then('the subscription should be created successfully', () => {
			expect(subscription).toBeDefined();
			expect(subscription).toBeInstanceOf(PersonalUserAccountProfileBillingSubscription);
		});
	});

	Scenario('Getting subscriptionId from subscription', ({ Given, When, Then }) => {
		let result: string;

		Given('I have a subscription with subscriptionId "sub-12345"', () => {
			props = makeSubscriptionProps({ subscriptionId: 'sub-12345' });
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I access the subscriptionId property', () => {
			result = subscription.subscriptionId;
		});

		Then('it should return "sub-12345"', () => {
			expect(result).toBe('sub-12345');
		});
	});

	Scenario('Getting planCode from subscription', ({ Given, When, Then }) => {
		let result: string;

		Given('I have a subscription with planCode "premium"', () => {
			props = makeSubscriptionProps({ planCode: 'premium' });
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I access the planCode property', () => {
			result = subscription.planCode;
		});

		Then('it should return "premium"', () => {
			expect(result).toBe('premium');
		});
	});

	Scenario('Getting status from subscription', ({ Given, When, Then }) => {
		let result: string;

		Given('I have a subscription with status "ACTIVE"', () => {
			props = makeSubscriptionProps({ status: 'ACTIVE' });
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I access the status property', () => {
			result = subscription.status;
		});

		Then('it should return "ACTIVE"', () => {
			expect(result).toBe('ACTIVE');
		});
	});

	Scenario('Getting startDate from subscription', ({ Given, When, Then }) => {
		let result: Date;
		const expectedDate = new Date('2024-01-01');

		Given('I have a subscription with a valid startDate', () => {
			props = makeSubscriptionProps({ startDate: expectedDate });
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I access the startDate property', () => {
			result = subscription.startDate;
		});

		Then('it should return the expected date', () => {
			expect(result).toEqual(expectedDate);
		});
	});

	Scenario('Setting subscriptionId with valid visa', ({ Given, When, Then }) => {
		Given('I have a subscription with a permissive visa', () => {
			props = makeSubscriptionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I set the subscriptionId to "sub-new-123"', () => {
			subscription.subscriptionId = 'sub-new-123';
		});

		Then('the subscriptionId should be updated to "sub-new-123"', () => {
			expect(subscription.subscriptionId).toBe('sub-new-123');
		});
	});

	Scenario('Setting planCode with valid visa', ({ Given, When, Then }) => {
		Given('I have a subscription with a permissive visa', () => {
			props = makeSubscriptionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I set the planCode to "enterprise"', () => {
			subscription.planCode = 'enterprise';
		});

		Then('the planCode should be updated to "enterprise"', () => {
			expect(subscription.planCode).toBe('enterprise');
		});
	});

	Scenario('Setting status with valid visa', ({ Given, When, Then }) => {
		Given('I have a subscription with a permissive visa', () => {
			props = makeSubscriptionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I set the status to "CANCELLED"', () => {
			subscription.status = 'CANCELLED';
		});

		Then('the status should be updated to "CANCELLED"', () => {
			expect(subscription.status).toBe('CANCELLED');
		});
	});

	Scenario('Setting startDate with valid visa', ({ Given, When, Then }) => {
		const newDate = new Date('2025-01-01');

		Given('I have a subscription with a permissive visa', () => {
			props = makeSubscriptionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I set the startDate to a new date', () => {
			subscription.startDate = newDate;
		});

		Then('the startDate should be updated', () => {
			expect(subscription.startDate).toEqual(newDate);
		});
	});

	Scenario('Setting subscriptionId without permission throws error', ({ Given, When, Then }) => {
		let error: Error | undefined;

		Given('I have a subscription with a restrictive visa', () => {
			props = makeSubscriptionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I attempt to set the subscriptionId without permission', () => {
			try {
				subscription.subscriptionId = 'unauthorized-id';
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError for subscription', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set subscription info');
		});
	});

	Scenario('Setting planCode without permission throws error', ({ Given, When, Then }) => {
		let error: Error | undefined;

		Given('I have a subscription with a restrictive visa', () => {
			props = makeSubscriptionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I attempt to set the planCode without permission', () => {
			try {
				subscription.planCode = 'unauthorized-plan';
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError for subscription', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set subscription info');
		});
	});

	Scenario('Setting status without permission throws error', ({ Given, When, Then }) => {
		let error: Error | undefined;

		Given('I have a subscription with a restrictive visa', () => {
			props = makeSubscriptionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I attempt to set the status without permission', () => {
			try {
				subscription.status = 'UNAUTHORIZED';
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError for subscription', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set subscription info');
		});
	});

	Scenario('Setting startDate without permission throws error', ({ Given, When, Then }) => {
		let error: Error | undefined;

		Given('I have a subscription with a restrictive visa', () => {
			props = makeSubscriptionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I attempt to set the startDate without permission', () => {
			try {
				subscription.startDate = new Date();
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError for subscription', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set subscription info');
		});
	});

	Scenario('Setting properties when entity is new bypasses visa check', ({ Given, When, Then }) => {
		Given('I have a subscription for a new entity', () => {
			props = makeSubscriptionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(true) as PersonalUserAggregateRoot;
			subscription = new PersonalUserAccountProfileBillingSubscription(props, visa, root);
		});

		When('I set the subscriptionId to "sub-new-entity"', () => {
			subscription.subscriptionId = 'sub-new-entity';
		});

		Then('the subscriptionId should be updated to "sub-new-entity"', () => {
			expect(subscription.subscriptionId).toBe('sub-new-entity');
		});
	});
});
