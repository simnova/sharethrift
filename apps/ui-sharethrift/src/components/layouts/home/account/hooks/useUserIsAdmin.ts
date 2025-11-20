import { useQuery } from '@apollo/client/react';
import {
	UseUserIsAdminDocument,
	type UseUserIsAdminQuery,
} from '../../../../../generated.tsx';

/*
 * Hook to check if current user is an admin to display UI components conditionally.
 * Uses the User union type to determine user type from the backend.
 */
export const useUserIsAdmin = () => {
	const { data, loading, error } = useQuery<UseUserIsAdminQuery>(
		UseUserIsAdminDocument,
	);

	return {
		isAdmin: data?.currentUser?.userIsAdmin ?? false,
		loading,
		error,
	};
};
