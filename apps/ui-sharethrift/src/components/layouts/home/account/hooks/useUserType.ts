import { useQuery } from '@apollo/client/react';
import {
	GetCurrentAdminUserDocument,
	type GetCurrentAdminUserQuery,
} from '../../../../../generated.tsx';

/*
 * Hook to check if current user is an admin to display UI components conditionally.
 * Returns null for currentAdminUser if user is not an admin.
 */
export const useUserIsAdmin = () => {
	// Check which portal type the user logged in with
	const loginPortalType = globalThis.sessionStorage?.getItem('loginPortalType');

	// Only query if explicitly logged in through AdminPortal
	const shouldQueryAdmin = loginPortalType === 'AdminPortal';

	const { data, loading, error } = useQuery<GetCurrentAdminUserQuery>(
		GetCurrentAdminUserDocument,
		{
			skip: !shouldQueryAdmin,
		},
	);

	return {
		isAdmin: !!data?.currentAdminUser,
		loading,
		error,
	};
};
