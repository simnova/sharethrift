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
} from '../../../../../generated.tsx';

export function ViewListingContainer({
	isAuthenticated,
}: {
	isAuthenticated: boolean;
}) {
	const { listingId } = useParams();
	
	// Check if we're viewing as admin
	const isAdminContext = globalThis.sessionStorage?.getItem('adminContext') === 'true';

	const {
		data: listingData,
		loading: listingLoading,
		error: listingError,
	} = useQuery<ViewListingQuery, ViewListingQueryVariables>(
		ViewListingDocument,
		{
			variables: { id: listingId },
			skip: !listingId,
			// Use network-only for admin context to bypass permissions cache
			fetchPolicy: isAdminContext ? 'network-only' : 'cache-first',
		},
	);

	const { data: currentUserData } = useQuery<ViewListingCurrentUserQuery>(
		ViewListingCurrentUserDocument,
		{
			skip: isAdminContext, // Skip user query if admin is viewing
		},
	);

	const reserverId =
		currentUserData?.currentPersonalUserAndCreateIfNotExists?.id ?? '';

	const skip = !reserverId || !listingId || isAdminContext;

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
	console.log('isAdminContext', isAdminContext);
	console.log('listingId', listingId);

	if (!listingId) return <div>Missing listing id.</div>;
	if (listingLoading) return <div>Loading listing...</div>;
	if (listingError) {
		console.error('Listing error:', listingError);
		return (
			<div>
				<div>Error loading listing: {listingError.message}</div>
				{isAdminContext && (
					<div style={{ marginTop: 16, fontSize: '12px', color: '#666' }}>
						<strong>Admin Note:</strong> You are viewing as admin. If this listing is 
						blocked/appealed, ensure the backend resolver is using systemApplicationServices 
						for admin users.
					</div>
				)}
			</div>
		);
	}
	if (!listingData?.itemListing) return <div>Listing not found.</div>;

	const sharedTimeAgo = listingData.itemListing.createdAt
		? computeTimeAgo(listingData.itemListing.createdAt)
		: undefined;

	// For admin context, userIsSharer is always false
	const userIsSharer = false;

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
