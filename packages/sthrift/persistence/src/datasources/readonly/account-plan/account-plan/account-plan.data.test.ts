import { describe, expect, it, vi } from 'vitest';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { AccountPlanDataSourceImpl } from './account-plan.data.ts';

function makeAccountPlanModel(): Models.AccountPlan.AccountPlanModelType {
	return {
		find: vi.fn().mockReturnValue({
			lean: vi.fn().mockReturnThis(),
			exec: vi.fn().mockResolvedValue([]),
		}),
		findOne: vi.fn().mockReturnValue({
			lean: vi.fn().mockReturnThis(),
			exec: vi.fn().mockResolvedValue(null),
		}),
		findById: vi.fn().mockReturnValue({
			lean: vi.fn().mockReturnThis(),
			exec: vi.fn().mockResolvedValue(null),
		}),
	} as unknown as Models.AccountPlan.AccountPlanModelType;
}

describe('AccountPlanDataSourceImpl', () => {
	it('should create an instance', () => {
		const model = makeAccountPlanModel();
		const dataSource = new AccountPlanDataSourceImpl(model);
		expect(dataSource).toBeDefined();
	});

	it('should have find method', () => {
		const model = makeAccountPlanModel();
		const dataSource = new AccountPlanDataSourceImpl(model);
		expect(typeof dataSource.find).toBe('function');
	});

	it('should have findOne method', () => {
		const model = makeAccountPlanModel();
		const dataSource = new AccountPlanDataSourceImpl(model);
		expect(typeof dataSource.findOne).toBe('function');
	});

	it('should have findById method', () => {
		const model = makeAccountPlanModel();
		const dataSource = new AccountPlanDataSourceImpl(model);
		expect(typeof dataSource.findById).toBe('function');
	});
});
