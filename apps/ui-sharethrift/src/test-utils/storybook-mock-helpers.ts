import { type AccountPlan, UseUserIsAdminDocument } from '../generated';

export const UserIsAdminMockRequest = (userId: string, isAdmin: boolean = false) => {
	const typename = isAdmin ? 'AdminUser' : 'PersonalUser';
	return {
		request: {
			query: UseUserIsAdminDocument,
		},
		maxUsageCount: Number.POSITIVE_INFINITY,

		result: {
			data: {
				currentUser: {
					__typename: typename,
					id: userId,
					userIsAdmin: isAdmin,
				},
			},
		},
	};
};

export const mockAccountPlans: AccountPlan[] = [
	{
		__typename: 'AccountPlan',
		id: 'plan-1',
		name: 'non-verified-personal',
		description: 'Basic free plan',
		billingPeriodLength: 1,
		billingPeriodUnit: 'month',
		billingAmount: 0,
		currency: 'USD',
		setupFee: 0,
		status: 'active',
		cybersourcePlanId: null,
		schemaVersion: '1.0',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		feature: {
			__typename: 'AccountPlanFeature',
			activeReservations: 5,
			bookmarks: 10,
			itemsToShare: 0,
			friends: 20,
		},
	},
	{
		__typename: 'AccountPlan',
		id: 'plan-2',
		name: 'verified-personal',
		description: 'Verified personal plan',
		billingPeriodLength: 1,
		billingPeriodUnit: 'month',
		billingAmount: 9.99,
		currency: 'USD',
		setupFee: 0,
		status: 'active',
		cybersourcePlanId: 'cyber-1',
		schemaVersion: '1.0',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		feature: {
			__typename: 'AccountPlanFeature',
			activeReservations: 20,
			bookmarks: 50,
			itemsToShare: 10,
			friends: 100,
		},
	},
	{
		__typename: 'AccountPlan',
		id: 'plan-3',
		name: 'verified-personal-plus',
		description: 'Premium plan',
		billingPeriodLength: 1,
		billingPeriodUnit: 'month',
		billingAmount: 19.99,
		currency: 'USD',
		setupFee: 0,
		status: 'active',
		cybersourcePlanId: 'cyber-2',
		schemaVersion: '1.0',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		feature: {
			__typename: 'AccountPlanFeature',
			activeReservations: 100,
			bookmarks: 200,
			itemsToShare: 50,
			friends: 500,
		},
	},
];
