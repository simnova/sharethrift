import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserAccountProfileBilling } from './personal-user-account-profile-billing.ts';
import { PersonalUserAccountProfileBillingSubscription } from './personal-user-account-profile-billing-subscription.ts';
import { PersonalUserAccountProfileBillingTransactions } from './personal-user-account-profile-billing-transactions.ts';
import type { PersonalUserAccountProfileBillingProps } from './personal-user-account-profile-billing.entity.ts';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.aggregate.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-account-profile-billing.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makeBillingProps(overrides?: Partial<PersonalUserAccountProfileBillingProps>): any {
	return {
		cybersourceCustomerId: 'customer-456',
		subscription: {
			subscriptionId: 'sub-123',
			planCode: 'basic',
			status: 'active',
			startDate: new Date('2024-01-01'),
		},
		transactions: {
			items: [
				{
					transactionId: 'txn-789',
					amount: 29.99,
					referenceId: 'ref-001',
					status: 'SUCCEEDED',
					completedAt: new Date('2024-01-15'),
					errorMessage: null,
				},
			],
		},
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

	Scenario('Billing subscription getter returns correct subscription object', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;
		let subscription: PersonalUserAccountProfileBillingSubscription;

		Given('I have a billing instance with subscription data', () => {
			const props = makeBillingProps({
				subscription: {
					subscriptionId: 'sub-test-123',
					planCode: 'premium',
					status: 'active',
					startDate: new Date('2024-02-01'),
				},
			});
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I access the subscription property', () => {
			subscription = billing.subscription;
		});

		Then('it should return a PersonalUserAccountProfileBillingSubscription instance', () => {
			expect(subscription).toBeDefined();
			expect(subscription).toBeInstanceOf(PersonalUserAccountProfileBillingSubscription);
			expect(subscription.subscriptionId).toBe('sub-test-123');
			expect(subscription.planCode).toBe('premium');
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

	Scenario('Billing transactions getter returns correct transactions array', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;
		let transactions: ReadonlyArray<PersonalUserAccountProfileBillingTransactions>;

		Given('I have a billing instance with transactions data', () => {
			const props = makeBillingProps({
				transactions: {
					items: [
						{
							transactionId: 'txn-abc-123',
							amount: 99.99,
							referenceId: 'ref-abc',
							status: 'SUCCEEDED',
							completedAt: new Date('2024-03-01'),
							errorMessage: null,
						},
						{
							transactionId: 'txn-def-456',
							amount: 49.99,
							referenceId: 'ref-def',
							status: 'PENDING',
							completedAt: new Date('2024-03-02'),
							errorMessage: null,
						},
					],
				},
			});
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I access the transactions property', () => {
			transactions = billing.transactions;
		});

		Then('it should return an array of PersonalUserAccountProfileBillingTransactions instances', () => {
			expect(transactions).toBeDefined();
			expect(transactions).toHaveLength(2);
			expect(transactions[0]).toBeInstanceOf(PersonalUserAccountProfileBillingTransactions);
			expect(transactions[0].transactionId).toBe('txn-abc-123');
			expect(transactions[0].amount).toBe(99.99);
			expect(transactions[1].transactionId).toBe('txn-def-456');
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

	Scenario('Billing cybersourceCustomerId setter works with valid visa', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;

		Given('I have a billing instance with a permissive visa', () => {
			const props = makeBillingProps({ cybersourceCustomerId: 'old-customer-id' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I set the cybersourceCustomerId property', () => {
			billing.cybersourceCustomerId = 'new-customer-id';
		});

		Then('the cybersourceCustomerId should be updated', () => {
			expect(billing.cybersourceCustomerId).toBe('new-customer-id');
		});
	});

	Scenario('Billing allows setters when entity is new', ({ Given, When, Then }) => {
		let billing: PersonalUserAccountProfileBilling;

		Given('I have a billing instance for a new entity', () => {
			const props = makeBillingProps({ cybersourceCustomerId: 'initial-customer' });
			const visa = createMockVisa(false) as UserVisa;
			const root = createMockRoot(true) as PersonalUserAggregateRoot;
			billing = new PersonalUserAccountProfileBilling(props, visa, root);
		});

		When('I set the cybersourceCustomerId property', () => {
			billing.cybersourceCustomerId = 'updated-customer';
		});

		Then('the cybersourceCustomerId should be updated without visa check', () => {
			expect(billing.cybersourceCustomerId).toBe('updated-customer');
		});
	});
});
