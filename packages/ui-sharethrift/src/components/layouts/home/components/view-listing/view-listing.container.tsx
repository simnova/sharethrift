import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
// Import the GraphQL document (Vite raw import if needed)
// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import { ViewListing } from './view-listing';
import {
	ViewListingCurrentUserDocument,
	type ViewListingCurrentUserQuery,
	ViewListingDocument,
	type ViewListingQuery,
	type ViewListingQueryVariables,
	ViewListingActiveReservationRequestForListingDocument,
	type ViewListingActiveReservationRequestForListingQuery,
	type ViewListingActiveReservationRequestForListingQueryVariables,
} from '../../../../../generated';

export function ViewListingContainer({
	isAuthenticated,
}: {
	isAuthenticated: boolean;
}) {
	const { listingId } = useParams();

	const {
		data: listingData,
		loading: listingLoading,
		error: listingError,
	} = useQuery<ViewListingQuery, ViewListingQueryVariables>(
		ViewListingDocument,
		{
			variables: { id: listingId },
			skip: !listingId,
			fetchPolicy: 'cache-first',
		},
	);

	const { data: currentUserData } = useQuery<ViewListingCurrentUserQuery>(
		ViewListingCurrentUserDocument,
	);

	const reserverId =
		currentUserData?.currentPersonalUserAndCreateIfNotExists?.id ?? '';

	const skip = !reserverId || !listingId;

	const {
		data: userReservationData,
		loading: userReservationLoading,
		error: userReservationError,
	} = useQuery<
		ViewListingActiveReservationRequestForListingQuery,
		ViewListingActiveReservationRequestForListingQueryVariables
	>(ViewListingActiveReservationRequestForListingDocument, {
		variables: { listingId: listingId ?? '', reserverId },
		skip,
	});

	console.log('userReservationLoading', userReservationLoading);
	console.log('userReservationError', userReservationError);

	if (!listingId) return <div>Missing listing id.</div>;
	if (listingLoading) return <div>Loading listing...</div>;
	if (listingError) return <div>Error loading listing.</div>;
	if (!listingData?.itemListing) return <div>Listing not found.</div>;

	const sharedTimeAgo = listingData.itemListing.createdAt
		? computeTimeAgo(listingData.itemListing.createdAt)
		: undefined;

	const userIsSharer =
		currentUserData?.currentPersonalUserAndCreateIfNotExists.id ===
		(listingData.itemListing.sharer as { id: string }).id;

	return (
		<ViewListing
			listing={listingData.itemListing}
			userIsSharer={userIsSharer}
			isAuthenticated={isAuthenticated}
			sharedTimeAgo={sharedTimeAgo}
			userReservationRequest={
				userReservationData?.myActiveReservationForListing
			}
		/>
	);
}

function computeTimeAgo(isoDate: string): string {
	try {
		const then = new Date(isoDate).getTime();
		const now = Date.now();
		const diffMs = Math.max(0, now - then);
		const diffHours = Math.floor(diffMs / 3_600_000);
		if (diffHours < 24) return `${diffHours}h ago`;
		const diffDays = Math.floor(diffHours / 24);
		return `${diffDays}d ago`;
	} catch {
		return '';
	}
}
