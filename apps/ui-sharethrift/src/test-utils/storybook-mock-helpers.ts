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
			__typename: 'AccountPlanFeature',
		},
		status: null,
		cybersourcePlanId: null,
		id: '607f1f77bcf86cd799439001',
		schemaVersion: '1.0.0',
		createdAt: '2023-05-02T10:00:00.000Z',
		updatedAt: '2023-05-02T10:00:00.000Z',
		__typename: 'AccountPlan',
	},
	{
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
			__typename: 'AccountPlanFeature',
		},
		status: null,
		cybersourcePlanId: null,
		id: '607f1f77bcf86cd799439002',
		schemaVersion: '1.0.0',
		createdAt: '2023-05-02T10:00:00.000Z',
		updatedAt: '2023-05-02T10:00:00.000Z',
		__typename: 'AccountPlan',
	},
	{
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
			__typename: 'AccountPlanFeature',
		},
		status: 'active',
		cybersourcePlanId: 'cybersource_plan_001',
		id: '607f1f77bcf86cd799439000',
		schemaVersion: '1.0.0',
		createdAt: '2023-05-02T10:00:00.000Z',
		updatedAt: '2023-05-02T10:00:00.000Z',
		__typename: 'AccountPlan',
	},
];
