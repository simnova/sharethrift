import { UseUserIsAdminDocument } from '../generated';

export const userIsAdminMockRequest = (
	userId: string,
	isAdmin: boolean = false,
) => {
	return {
		request: {
			query: UseUserIsAdminDocument,
		},
		maxUsageCount: Number.POSITIVE_INFINITY,

		result: {
			data: {
				currentUser: { id: userId, userIsAdmin: isAdmin },
			},
		},
	};
};
