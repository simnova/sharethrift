import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserAccountProfileBilling } from './personal-user-account-profile-billing.ts';
import type { PersonalUserAccountProfileBillingProps } from './personal-user-account-profile-billing.entity.ts';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-account-profile-billing.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makeBillingProps(overrides?: Partial<PersonalUserAccountProfileBillingProps>): any {
	return {
		subscriptionId: 'sub-123',
		cybersourceCustomerId: 'customer-456',
		paymentState: 'active',
		lastTransactionId: 'txn-789',
		lastPaymentAmount: 29.99,
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

test.for(feature, ({ Scenario }) => {
	Scenario('Billing value object can be created with valid props', ({ Given, When, Then }) => {
		let props: PersonalUserAccountProfileBillingProps;
		let billing: PersonalUserAccountProfileBilling;

		Given('I have billing props with all fields', () => {
			props = makeBillingProps();
		});

		When('I create a PersonalUserAccountProfileBilling instance', () => {
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		Then('it should be created successfully', () => {
			expect(billing).toBeDefined();
			expect(billing).toBeInstanceOf(PersonalUserAccountProfileBilling);
		});
	});

	Scenario('Billing subscriptionId getter returns correct value', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;
		let value: string | null;

		Given('I have a billing instance with subscriptionId', () => {
			const props = makeBillingProps({ subscriptionId: 'sub-test-123' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I access the subscriptionId property', () => {
			value = billing.subscriptionId;
		});

		Then('it should return the correct subscriptionId value', () => {
			expect(value).toBe('sub-test-123');
		});
	});

	Scenario('Billing cybersourceCustomerId getter returns correct value', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;
		let value: string | null;

		Given('I have a billing instance with cybersourceCustomerId', () => {
			const props = makeBillingProps({ cybersourceCustomerId: 'cs-customer-999' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I access the cybersourceCustomerId property', () => {
			value = billing.cybersourceCustomerId;
		});

		Then('it should return the correct cybersourceCustomerId value', () => {
			expect(value).toBe('cs-customer-999');
		});
	});

	Scenario('Billing paymentState getter returns correct value', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;
		let value: string;

		Given('I have a billing instance with paymentState', () => {
			const props = makeBillingProps({ paymentState: 'SUCCEEDED' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I access the paymentState property', () => {
			value = billing.paymentState;
		});

		Then('it should return the correct paymentState value', () => {
			expect(value).toBe('SUCCEEDED');
		});
	});

	Scenario('Billing lastTransactionId getter returns correct value', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;
		let value: string | null;

		Given('I have a billing instance with lastTransactionId', () => {
			const props = makeBillingProps({ lastTransactionId: 'txn-abc-123' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I access the lastTransactionId property', () => {
			value = billing.lastTransactionId;
		});

		Then('it should return the correct lastTransactionId value', () => {
			expect(value).toBe('txn-abc-123');
		});
	});

	Scenario('Billing lastPaymentAmount getter returns correct value', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;
		let value: number | null;

		Given('I have a billing instance with lastPaymentAmount', () => {
			const props = makeBillingProps({ lastPaymentAmount: 99.99 });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I access the lastPaymentAmount property', () => {
			value = billing.lastPaymentAmount;
		});

		Then('it should return the correct lastPaymentAmount value', () => {
			expect(value).toBe(99.99);
		});
	});

	Scenario('Billing subscriptionId setter requires valid visa', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;
		let error: Error | undefined;

		Given('I have a billing instance with a restrictive visa', () => {
			const props = makeBillingProps();
			const visa = createMockVisa(false) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I attempt to set subscriptionId without permission', () => {
			try {
				billing.subscriptionId = 'new-sub-id';
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set billing info');
		});
	});

	Scenario('Billing subscriptionId setter works with valid visa', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;

		Given('I have a billing instance with a permissive visa', () => {
			const props = makeBillingProps({ subscriptionId: 'old-sub-id' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I set the subscriptionId property', () => {
			billing.subscriptionId = 'new-sub-id';
		});

		Then('the subscriptionId should be updated', () => {
			expect(billing.subscriptionId).toBe('new-sub-id');
		});
	});

	Scenario('Billing cybersourceCustomerId setter requires valid visa', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;
		let error: Error | undefined;

		Given('I have a billing instance with a restrictive visa', () => {
			const props = makeBillingProps();
			const visa = createMockVisa(false) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I attempt to set cybersourceCustomerId without permission', () => {
			try {
				billing.cybersourceCustomerId = 'new-customer-id';
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set billing info');
		});
	});

	Scenario('Billing allows setters when entity is new', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;

		Given('I have a billing instance for a new entity', () => {
			const props = makeBillingProps({ subscriptionId: 'initial-sub' });
			const visa = createMockVisa(false) as UserVisa;
			const root = createMockRoot(true) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I set the subscriptionId property', () => {
			billing.subscriptionId = 'updated-sub';
		});

		Then('the subscriptionId should be updated without visa check', () => {
			expect(billing.subscriptionId).toBe('updated-sub');
		});
	});
});
