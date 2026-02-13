import { UseUserIsAdminDocument } from '../generated';

export const userIsAdminMockRequest = (
	userId: string,
	isAdmin: boolean = false,
) => {
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
