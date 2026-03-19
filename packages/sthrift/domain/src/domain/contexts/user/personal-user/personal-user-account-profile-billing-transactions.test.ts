import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserAccountProfileBillingTransactions } from './personal-user-account-profile-billing-transactions.ts';
import type { PersonalUserAccountProfileBillingTransactionsProps } from './personal-user-account-profile-billing-transactions.entity.ts';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.aggregate.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-account-profile-billing-transactions.feature'),
);

function makeTransactionProps(
	overrides?: Partial<PersonalUserAccountProfileBillingTransactionsProps>,
): PersonalUserAccountProfileBillingTransactionsProps {
	return {
		id: 'trans-1',
		transactionId: 'txn-12345',
		amount: 99.99,
		referenceId: 'ref-12345',
		status: 'SUCCEEDED',
		completedAt: new Date('2024-01-15'),
		errorMessage: null,
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
	let props: PersonalUserAccountProfileBillingTransactionsProps;
	let transaction: PersonalUserAccountProfileBillingTransactions;
	let visa: UserVisa;
	let root: PersonalUserAggregateRoot;

	Background(({ Given }) => {
		Given('I have valid billing transactions props', () => {
			props = makeTransactionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
		});
	});

	Scenario('Creating a billing transactions instance', ({ When, Then }) => {
		When('I create a PersonalUserAccountProfileBillingTransactions instance', () => {
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		Then('the transactions instance should be created successfully', () => {
			expect(transaction).toBeDefined();
			expect(transaction).toBeInstanceOf(PersonalUserAccountProfileBillingTransactions);
		});
	});

	Scenario('Getting transactionId from transactions', ({ Given, When, Then }) => {
		let result: string;

		Given('I have a transaction with transactionId "txn-12345"', () => {
			props = makeTransactionProps({ transactionId: 'txn-12345' });
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I access the transactionId property', () => {
			result = transaction.transactionId;
		});

		Then('it should return "txn-12345"', () => {
			expect(result).toBe('txn-12345');
		});
	});

	Scenario('Getting amount from transactions', ({ Given, When, Then }) => {
		let result: number;

		Given('I have a transaction with amount 99.99', () => {
			props = makeTransactionProps({ amount: 99.99 });
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I access the amount property', () => {
			result = transaction.amount;
		});

		Then('it should return 99.99', () => {
			expect(result).toBe(99.99);
		});
	});

	Scenario('Getting referenceId from transactions', ({ Given, When, Then }) => {
		let result: string;

		Given('I have a transaction with referenceId "ref-12345"', () => {
			props = makeTransactionProps({ referenceId: 'ref-12345' });
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I access the referenceId property', () => {
			result = transaction.referenceId;
		});

		Then('it should return "ref-12345"', () => {
			expect(result).toBe('ref-12345');
		});
	});

	Scenario('Getting status from transactions', ({ Given, When, Then }) => {
		let result: string;

		Given('I have a transaction with status "SUCCEEDED"', () => {
			props = makeTransactionProps({ status: 'SUCCEEDED' });
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I access the status property', () => {
			result = transaction.status;
		});

		Then('it should return "SUCCEEDED"', () => {
			expect(result).toBe('SUCCEEDED');
		});
	});

	Scenario('Getting completedAt from transactions', ({ Given, When, Then }) => {
		let result: Date;
		const expectedDate = new Date('2024-01-15');

		Given('I have a transaction with a valid completedAt date', () => {
			props = makeTransactionProps({ completedAt: expectedDate });
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I access the completedAt property', () => {
			result = transaction.completedAt;
		});

		Then('it should return the expected date', () => {
			expect(result).toEqual(expectedDate);
		});
	});

	Scenario('Getting errorMessage from transactions when null', ({ Given, When, Then }) => {
		let result: string | null;

		Given('I have a transaction with no errorMessage', () => {
			props = makeTransactionProps({ errorMessage: null });
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I access the errorMessage property', () => {
			result = transaction.errorMessage;
		});

		Then('it should return null', () => {
			expect(result).toBeNull();
		});
	});

	Scenario('Getting errorMessage from transactions when set', ({ Given, When, Then }) => {
		let result: string | null;

		Given('I have a transaction with errorMessage "Payment failed"', () => {
			props = makeTransactionProps({ errorMessage: 'Payment failed' });
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I access the errorMessage property', () => {
			result = transaction.errorMessage;
		});

		Then('it should return "Payment failed"', () => {
			expect(result).toBe('Payment failed');
		});
	});

	Scenario('Setting transactionId with valid visa', ({ Given, When, Then }) => {
		Given('I have a transaction with a permissive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I set the transactionId to "txn-new-123"', () => {
			transaction.transactionId = 'txn-new-123';
		});

		Then('the transactionId should be updated to "txn-new-123"', () => {
			expect(transaction.transactionId).toBe('txn-new-123');
		});
	});

	Scenario('Setting amount with valid visa', ({ Given, When, Then }) => {
		Given('I have a transaction with a permissive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I set the amount to 149.99', () => {
			transaction.amount = 149.99;
		});

		Then('the amount should be updated to 149.99', () => {
			expect(transaction.amount).toBe(149.99);
		});
	});

	Scenario('Setting referenceId with valid visa', ({ Given, When, Then }) => {
		Given('I have a transaction with a permissive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I set the referenceId to "ref-new-123"', () => {
			transaction.referenceId = 'ref-new-123';
		});

		Then('the referenceId should be updated to "ref-new-123"', () => {
			expect(transaction.referenceId).toBe('ref-new-123');
		});
	});

	Scenario('Setting status with valid visa', ({ Given, When, Then }) => {
		Given('I have a transaction with a permissive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I set the status to "FAILED"', () => {
			transaction.status = 'FAILED';
		});

		Then('the status should be updated to "FAILED"', () => {
			expect(transaction.status).toBe('FAILED');
		});
	});

	Scenario('Setting completedAt with valid visa', ({ Given, When, Then }) => {
		const newDate = new Date('2025-01-01');

		Given('I have a transaction with a permissive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I set the completedAt to a new date', () => {
			transaction.completedAt = newDate;
		});

		Then('the completedAt should be updated', () => {
			expect(transaction.completedAt).toEqual(newDate);
		});
	});

	Scenario('Setting errorMessage with valid visa', ({ Given, When, Then }) => {
		Given('I have a transaction with a permissive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(true) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I set the errorMessage to "Network error"', () => {
			transaction.errorMessage = 'Network error';
		});

		Then('the errorMessage should be updated to "Network error"', () => {
			expect(transaction.errorMessage).toBe('Network error');
		});
	});

	Scenario('Setting transactionId without permission throws error', ({ Given, When, Then }) => {
		let error: Error | undefined;

		Given('I have a transaction with a restrictive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I attempt to set the transactionId without permission', () => {
			try {
				transaction.transactionId = 'unauthorized-id';
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError for transaction', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set transaction info');
		});
	});

	Scenario('Setting amount without permission throws error', ({ Given, When, Then }) => {
		let error: Error | undefined;

		Given('I have a transaction with a restrictive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I attempt to set the amount without permission', () => {
			try {
				transaction.amount = 999.99;
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError for transaction', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set transaction info');
		});
	});

	Scenario('Setting referenceId without permission throws error', ({ Given, When, Then }) => {
		let error: Error | undefined;

		Given('I have a transaction with a restrictive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I attempt to set the referenceId without permission', () => {
			try {
				transaction.referenceId = 'unauthorized-ref';
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError for transaction', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set transaction info');
		});
	});

	Scenario('Setting status without permission throws error', ({ Given, When, Then }) => {
		let error: Error | undefined;

		Given('I have a transaction with a restrictive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I attempt to set the status without permission', () => {
			try {
				transaction.status = 'UNAUTHORIZED';
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError for transaction', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set transaction info');
		});
	});

	Scenario('Setting completedAt without permission throws error', ({ Given, When, Then }) => {
		let error: Error | undefined;

		Given('I have a transaction with a restrictive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I attempt to set the completedAt without permission', () => {
			try {
				transaction.completedAt = new Date();
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError for transaction', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set transaction info');
		});
	});

	Scenario('Setting errorMessage without permission throws error', ({ Given, When, Then }) => {
		let error: Error | undefined;

		Given('I have a transaction with a restrictive visa', () => {
			props = makeTransactionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(false) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I attempt to set the errorMessage without permission', () => {
			try {
				transaction.errorMessage = 'Unauthorized error';
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError for transaction', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set transaction info');
		});
	});

	Scenario('Setting properties when entity is new bypasses visa check', ({ Given, When, Then }) => {
		Given('I have a transaction for a new entity', () => {
			props = makeTransactionProps();
			visa = createMockVisa(false) as UserVisa;
			root = createMockRoot(true) as PersonalUserAggregateRoot;
			transaction = new PersonalUserAccountProfileBillingTransactions(props, visa, root);
		});

		When('I set the transactionId to "txn-new-entity"', () => {
			transaction.transactionId = 'txn-new-entity';
		});

		Then('the transactionId should be updated to "txn-new-entity"', () => {
			expect(transaction.transactionId).toBe('txn-new-entity');
		});
	});
});
