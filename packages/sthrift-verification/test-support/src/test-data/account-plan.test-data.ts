import type { Domain } from '@sthrift/domain';

const accountPlans = new Map<string, Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference>([
	[
		'607f1f77bcf86cd799439001',
		{
			id: '607f1f77bcf86cd799439001',
			name: 'non-verified-personal',
			description: 'Non-Verified Personal',
			billingPeriodLength: 0,
			billingPeriodUnit: 'month',
			billingAmount: 0,
			currency: 'USD',
			setupFee: 0,
			feature: {
				activeReservations: 0,
				bookmarks: 3,
				itemsToShare: 15,
				friends: 5,
			},
			schemaVersion: '1.0.0',
			createdAt: new Date('2023-05-02T10:00:00Z'),
			updatedAt: new Date('2023-05-02T10:00:00Z'),
		} as Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference,
	],
	[
		'607f1f77bcf86cd799439002',
		{
			id: '607f1f77bcf86cd799439002',
			name: 'verified-personal',
			description: 'Verified Personal',
			billingPeriodLength: 0,
			billingPeriodUnit: 'month',
			billingAmount: 0,
			currency: 'USD',
			setupFee: 0,
			feature: {
				activeReservations: 10,
				bookmarks: 10,
				itemsToShare: 30,
				friends: 10,
			},
			schemaVersion: '1.0.0',
			createdAt: new Date('2023-05-02T10:00:00Z'),
			updatedAt: new Date('2023-05-02T10:00:00Z'),
		} as Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference,
	],
]);

export function getAllMockAccountPlans(): Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference[] {
	return Array.from(accountPlans.values());
}
