import { useQuery } from '@apollo/client/react';
import {
	ViewListingCurrentUserDocument,
	type ViewListingCurrentUserQuery,
} from '../../../../../generated.tsx';

export function useCurrentUserId() {
	const { data, loading, error } = useQuery<ViewListingCurrentUserQuery>(
		ViewListingCurrentUserDocument,
		{ fetchPolicy: 'cache-first' },
	);
	return {
		userId: data?.currentPersonalUserAndCreateIfNotExists?.id,
		loading,
		error,
	};
}
