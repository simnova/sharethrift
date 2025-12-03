import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { PersonalUserAccountProfileBillingProps } from './personal-user-account-profile-billing.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-account-profile-billing.entity.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makePersonalUserAccountProfileBillingProps(overrides?: Partial<PersonalUserAccountProfileBillingProps>): any {
	return {
		subscriptionId: 'sub-123',
		cybersourceCustomerId: 'customer-456',
		paymentState: 'active',
		lastTransactionId: 'txn-789',
		lastPaymentAmount: 29.99,
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have a billing props object', () => {
			props = makePersonalUserAccountProfileBillingProps();
		});
	});

	Scenario('Billing subscriptionId can be string or null', ({ When, Then }) => {
		When('I access the subscriptionId property', () => {
			// Access the property
		});

		Then('it should be a string or null', () => {
			const billingProps: PersonalUserAccountProfileBillingProps = props;
			expect(billingProps.subscriptionId).toBe('sub-123');
		});
	});

	Scenario('Billing cybersourceCustomerId can be string or null', ({ When, Then }) => {

		When('I access the cybersourceCustomerId property', () => {
			// Access the property
		});

		Then('it should be null or a string', () => {
			const billingProps: PersonalUserAccountProfileBillingProps = props;
			expect(billingProps.cybersourceCustomerId === null || typeof billingProps.cybersourceCustomerId === 'string').toBe(true);
		});
	});

	Scenario('Billing paymentState should be a string', ({ When, Then }) => {

		When('I access the paymentState property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const billingProps: PersonalUserAccountProfileBillingProps = props;
			expect(typeof billingProps.paymentState).toBe('string');
			expect(billingProps.paymentState).toBe('active');
		});
	});

	Scenario('Billing lastTransactionId can be string or null', ({ When, Then }) => {

		When('I access the lastTransactionId property', () => {
			// Access the property
		});

		Then('it should be a string or null', () => {
			const billingProps: PersonalUserAccountProfileBillingProps = props;
			expect(billingProps.lastTransactionId).toBe('txn-789');
		});
	});

	Scenario('Billing lastPaymentAmount can be number or null', ({ When, Then }) => {

		When('I access the lastPaymentAmount property', () => {
			// Access the property
		});

		Then('it should be a number or null', () => {
			const billingProps: PersonalUserAccountProfileBillingProps = props;
			expect(typeof billingProps.lastPaymentAmount).toBe('number');
			expect(billingProps.lastPaymentAmount).toBe(29.99);
		});
	});
});
