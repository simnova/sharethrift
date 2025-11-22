import type { Models } from '@sthrift/data-sources-mongoose-models';

export const accountPlans = [
	// free plans
	{
		_id: '607f1f77bcf86cd799439001',
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
	},
	{
		_id: '607f1f77bcf86cd799439002',
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
	},
	// paid plan
	{
		_id: '607f1f77bcf86cd799439000',
		// refer to the left side
		name: 'verified-personal-plus',
		description: 'Verified Personal Plus',
		billingPeriodLength: 12,
		billingPeriodUnit: 'month',
		billingAmount: 4.99,
		currency: 'USD',
		setupFee: 0,
		feature: {
			activeReservations: 30,
			bookmarks: 30,
			itemsToShare: 50,
			friends: 30,
		},
		status: 'active',
		cybersourcePlanId: 'cybersource_plan_001', // assumed cybersource plan id
		schemaVersion: '1.0.0',
		createdAt: new Date('2023-05-02T10:00:00Z'),
		updatedAt: new Date('2023-05-02T10:00:00Z'),
	},
] as unknown as Models.AccountPlan.AccountPlan[];
