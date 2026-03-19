import { describe, expect, it, vi } from 'vitest';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import { AccountPlanContextPersistence } from './index.ts';

function makePassport(): Domain.Passport {
	return vi.mocked({
		accountPlan: {
			forAccountPlan: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

function makeModelsContext(): ModelsContext {
	return {
		AccountPlan: {
			AccountPlanModel: {
				findOne: vi.fn(),
				find: vi.fn(),
				create: vi.fn(),
				findById: vi.fn(),
			} as unknown as Models.AccountPlan.AccountPlanModelType,
		},
	} as unknown as ModelsContext;
}

describe('AccountPlanContextPersistence', () => {
	it('should create AccountPlan context with AccountPlanUnitOfWork', () => {
		const models = makeModelsContext();
		const passport = makePassport();

		const result = AccountPlanContextPersistence(models, passport);

		expect(result).toBeDefined();
		expect(result.AccountPlan).toBeDefined();
		expect(result.AccountPlan.AccountPlanUnitOfWork).toBeDefined();
	});

	it('should have withTransaction method on UnitOfWork', () => {
		const models = makeModelsContext();
		const passport = makePassport();

		const result = AccountPlanContextPersistence(models, passport);

		expect(
			typeof result.AccountPlan.AccountPlanUnitOfWork.withTransaction,
		).toBe('function');
	});

	it('should have withScopedTransaction method on UnitOfWork', () => {
		const models = makeModelsContext();
		const passport = makePassport();

		const result = AccountPlanContextPersistence(models, passport);

		expect(
			typeof result.AccountPlan.AccountPlanUnitOfWork.withScopedTransaction,
		).toBe('function');
	});
});
