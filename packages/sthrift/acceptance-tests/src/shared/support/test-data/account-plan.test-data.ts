import type { Domain } from '@sthrift/domain';

const accountPlans = new Map<string, Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference>();

let accountPlanCounter = 1;

export function createMockAccountPlan(): Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference {
	const plan = {
		id: `plan-${accountPlanCounter}`,
		createdAt: new Date(),
		updatedAt: new Date(),
	} as Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference;
	accountPlans.set(plan.id, plan);
	accountPlanCounter++;
	return plan;
}

export function getMockAccountPlanById(id: string): Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference | null {
	return accountPlans.get(id) ?? null;
}

export function getAllMockAccountPlans(): Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference[] {
	return Array.from(accountPlans.values());
}

export function clearMockAccountPlans(): void {
	accountPlans.clear();
	accountPlanCounter = 1;
}
