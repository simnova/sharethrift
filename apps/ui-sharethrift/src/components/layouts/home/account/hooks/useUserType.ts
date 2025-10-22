import { useQuery } from '@apollo/client/react';
import {
	GetCurrentAdminUserDocument,
	type GetCurrentAdminUserQuery,
} from '../../../../../generated.tsx';

/**
 * Hook to check if current user is an admin.
 * Returns null for currentAdminUser if user is not an admin.
 * 
 * Note: This is only for UI convenience - actual authorization
 * happens on the backend via GraphQL resolvers and domain layer.
 */
export const useIsAdmin = () => {
	const { data, loading, error } = useQuery<GetCurrentAdminUserQuery>(
		GetCurrentAdminUserDocument,
	);

	return {
		isAdmin: !!data?.currentAdminUser,
		loading,
		error,
	};
};
