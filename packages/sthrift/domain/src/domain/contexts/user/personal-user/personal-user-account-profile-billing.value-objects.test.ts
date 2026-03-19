import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PaymentState, PaymentStateEnum } from './personal-user-account-profile-billing.value-objects.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-account-profile-billing.value-objects.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('PaymentState Pending constant is valid', ({ When, Then }) => {
		let paymentState: PaymentState;

		When('I access PaymentState.Pending', () => {
			paymentState = PaymentState.Pending;
		});

		Then('it should be a PaymentState instance with value PENDING', () => {
			expect(paymentState).toBeInstanceOf(PaymentState);
			expect(paymentState.valueOf()).toBe(PaymentStateEnum.Pending);
			expect(paymentState.valueOf()).toBe('PENDING');
		});
	});

	Scenario('PaymentState Succeeded constant is valid', ({ When, Then }) => {
		let paymentState: PaymentState;

		When('I access PaymentState.Succeeded', () => {
			paymentState = PaymentState.Succeeded;
		});

		Then('it should be a PaymentState instance with value SUCCEEDED', () => {
			expect(paymentState).toBeInstanceOf(PaymentState);
			expect(paymentState.valueOf()).toBe(PaymentStateEnum.Succeeded);
			expect(paymentState.valueOf()).toBe('SUCCEEDED');
		});
	});

	Scenario('PaymentState Failed constant is valid', ({ When, Then }) => {
		let paymentState: PaymentState;

		When('I access PaymentState.Failed', () => {
			paymentState = PaymentState.Failed;
		});

		Then('it should be a PaymentState instance with value FAILED', () => {
			expect(paymentState).toBeInstanceOf(PaymentState);
			expect(paymentState.valueOf()).toBe(PaymentStateEnum.Failed);
			expect(paymentState.valueOf()).toBe('FAILED');
		});
	});

	Scenario('PaymentState Refunded constant is valid', ({ When, Then }) => {
		let paymentState: PaymentState;

		When('I access PaymentState.Refunded', () => {
			paymentState = PaymentState.Refunded;
		});

		Then('it should be a PaymentState instance with value REFUNDED', () => {
			expect(paymentState).toBeInstanceOf(PaymentState);
			expect(paymentState.valueOf()).toBe(PaymentStateEnum.Refunded);
			expect(paymentState.valueOf()).toBe('REFUNDED');
		});
	});

	Scenario('PaymentState can be created with valid value', ({ Given, When, Then }) => {
		let validValue: string;
		let paymentState: PaymentState;

		Given('I have a valid payment state string', () => {
			validValue = 'PENDING';
		});

		When('I create a PaymentState instance', () => {
			paymentState = new PaymentState(validValue);
		});

		Then('it should be created successfully', () => {
			expect(paymentState).toBeInstanceOf(PaymentState);
			expect(paymentState.valueOf()).toBe('PENDING');
		});
	});

	Scenario('PaymentState rejects invalid length string', ({ Given, When, Then }) => {
		let invalidValue: string;
		let error: Error | undefined;

		Given('I have a string with invalid length', () => {
			invalidValue = 'ABC';
		});

		When('I attempt to create a PaymentState instance', () => {
			try {
				new PaymentState(invalidValue);
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a validation error', () => {
			expect(error).toBeDefined();
		});
	});
});
