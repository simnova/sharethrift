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
	// Check which portal type the user logged in with
	const loginPortalType = globalThis.sessionStorage?.getItem('loginPortalType');
	
	// If loginPortalType is not set (e.g., old session), query anyway and let backend decide
	// If it's explicitly 'UserPortal', skip the query
	const shouldSkipQuery = loginPortalType === 'UserPortal';

	const { data, loading, error } = useQuery<GetCurrentAdminUserQuery>(
		GetCurrentAdminUserDocument,
		{
			skip: shouldSkipQuery,
		}
	);

	return {
		isAdmin: !!data?.currentAdminUser,
		loading,
		error,
	};
};
