import { describe, expect, it, vi } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { AccountPlanReadRepositoryImpl } from './index.ts';

vi.mock('./account-plan.read-repository.ts', () => ({
	getAccountPlanReadRepository: vi.fn().mockReturnValue({
		getAll: vi.fn(),
		getById: vi.fn(),
		getByName: vi.fn(),
	}),
}));

function makeModelsContext(): ModelsContext {
	return {
		AccountPlan: {
			AccountPlanModel: {},
		},
	} as ModelsContext;
}

function makePassport(): Domain.Passport {
	return {
		forMember: vi.fn().mockReturnThis(),
		determineIf: vi.fn().mockReturnValue({
			isCurrentUser: false,
			canManageMembers: false,
		}),
	} as unknown as Domain.Passport;
}

describe('AccountPlanReadRepositoryImpl factory', () => {
	it('should return an object with AccountPlanReadRepo', () => {
		const models = makeModelsContext();
		const passport = makePassport();
		const result = AccountPlanReadRepositoryImpl(models, passport);
		expect(result).toHaveProperty('AccountPlanReadRepo');
	});

	it('should return AccountPlanReadRepo with expected methods', () => {
		const models = makeModelsContext();
		const passport = makePassport();
		const result = AccountPlanReadRepositoryImpl(models, passport);
		expect(result.AccountPlanReadRepo).toBeDefined();
		expect(typeof result.AccountPlanReadRepo.getAll).toBe('function');
		expect(typeof result.AccountPlanReadRepo.getById).toBe('function');
		expect(typeof result.AccountPlanReadRepo.getByName).toBe('function');
	});
});
