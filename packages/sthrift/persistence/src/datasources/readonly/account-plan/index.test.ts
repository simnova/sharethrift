import { describe, expect, it, vi } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import { AccountPlanContext } from './index.ts';

vi.mock('./account-plan/index.ts', () => ({
	AccountPlanReadRepositoryImpl: vi.fn().mockReturnValue({
		AccountPlanReadRepo: {
			getAll: vi.fn(),
			getById: vi.fn(),
			getByName: vi.fn(),
		},
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

describe('AccountPlanContext factory', () => {
	it('should return an object with AccountPlan property', () => {
		const models = makeModelsContext();
		const passport = makePassport();
		const result = AccountPlanContext(models, passport);
		expect(result).toHaveProperty('AccountPlan');
	});

	it('should return AccountPlan with AccountPlanReadRepo', () => {
		const models = makeModelsContext();
		const passport = makePassport();
		const result = AccountPlanContext(models, passport);
		expect(result.AccountPlan).toHaveProperty('AccountPlanReadRepo');
	});

	it('should return AccountPlanReadRepo with expected methods', () => {
		const models = makeModelsContext();
		const passport = makePassport();
		const result = AccountPlanContext(models, passport);
		expect(result.AccountPlan.AccountPlanReadRepo).toBeDefined();
		expect(typeof result.AccountPlan.AccountPlanReadRepo.getAll).toBe('function');
		expect(typeof result.AccountPlan.AccountPlanReadRepo.getById).toBe('function');
		expect(typeof result.AccountPlan.AccountPlanReadRepo.getByName).toBe('function');
	});
});
