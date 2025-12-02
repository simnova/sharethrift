import { describe, expect, it, vi } from 'vitest';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { PersonalUserAccountProfileBillingTransactionsDomainAdapter } from './personal-user.domain-adapter.ts';

function makeTransactionDoc(
	overrides: Partial<Models.User.PersonalUserAccountProfileBillingTransactions> = {},
): Models.User.PersonalUserAccountProfileBillingTransactions {
	const base = {
		id: new MongooseSeedwork.ObjectId('123456789012345678901234'),
		transactionId: 'txn-001',
		amount: 50,
		referenceId: 'ref-001',
		status: 'completed',
		completedAt: new Date('2024-01-01'),
		errorMessage: null,
		...overrides,
	} as Models.User.PersonalUserAccountProfileBillingTransactions;
	return vi.mocked(base);
}

describe('PersonalUserAccountProfileBillingTransactionsDomainAdapter', () => {
	describe('constructor', () => {
		it('should create an instance with a valid document', () => {
			const doc = makeTransactionDoc();
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			expect(adapter).toBeDefined();
			expect(adapter.doc).toBe(doc);
		});
	});

	describe('id property', () => {
		it('should return the transaction id as string', () => {
			const doc = makeTransactionDoc();
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			const id = adapter.id;
			expect(id).toBeDefined();
		});
	});

	describe('transactionId property', () => {
		it('should get the transactionId', () => {
			const doc = makeTransactionDoc({ transactionId: 'txn-123' });
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			expect(adapter.transactionId).toBe('txn-123');
		});

		it('should set the transactionId', () => {
			const doc = makeTransactionDoc();
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			adapter.transactionId = 'txn-456';
			expect(doc.transactionId).toBe('txn-456');
		});
	});

	describe('amount property', () => {
		it('should get the amount', () => {
			const doc = makeTransactionDoc({ amount: 100 });
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			expect(adapter.amount).toBe(100);
		});

		it('should set the amount', () => {
			const doc = makeTransactionDoc();
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			adapter.amount = 200;
			expect(doc.amount).toBe(200);
		});
	});

	describe('referenceId property', () => {
		it('should get the referenceId', () => {
			const doc = makeTransactionDoc({ referenceId: 'ref-123' });
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			expect(adapter.referenceId).toBe('ref-123');
		});

		it('should set the referenceId', () => {
			const doc = makeTransactionDoc();
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			adapter.referenceId = 'ref-456';
			expect(doc.referenceId).toBe('ref-456');
		});
	});

	describe('status property', () => {
		it('should get the status', () => {
			const doc = makeTransactionDoc({ status: 'pending' });
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			expect(adapter.status).toBe('pending');
		});

		it('should set the status', () => {
			const doc = makeTransactionDoc();
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			adapter.status = 'failed';
			expect(doc.status).toBe('failed');
		});
	});

	describe('completedAt property', () => {
		it('should get the completedAt date', () => {
			const testDate = new Date('2024-06-01');
			const doc = makeTransactionDoc({ completedAt: testDate });
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			expect(adapter.completedAt).toEqual(testDate);
		});

		it('should set the completedAt date', () => {
			const newDate = new Date('2024-12-01');
			const doc = makeTransactionDoc();
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			adapter.completedAt = newDate;
			expect(doc.completedAt).toEqual(newDate);
		});
	});

	describe('errorMessage property', () => {
		it('should get the errorMessage when it exists', () => {
			const doc = makeTransactionDoc({ errorMessage: 'Payment declined' });
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			expect(adapter.errorMessage).toBe('Payment declined');
		});

		it('should get null when errorMessage is null', () => {
			const doc = makeTransactionDoc({ errorMessage: null });
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			expect(adapter.errorMessage).toBeNull();
		});

		it('should set the errorMessage', () => {
			const doc = makeTransactionDoc();
			const adapter = new PersonalUserAccountProfileBillingTransactionsDomainAdapter(doc);
			adapter.errorMessage = 'Insufficient funds';
			expect(doc.errorMessage).toBe('Insufficient funds');
		});
	});
});
