import { useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useParams } from 'react-router-dom';
import {
	type ItemListing,
	ViewListingActiveReservationRequestForListingDocument,
	ViewListingCurrentUserDocument,
	ViewListingDocument,
} from '../../../../../generated.tsx';
import { ViewListing } from './view-listing';

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

interface ViewListingContainerProps {
	isAuthenticated: boolean;
}

export const ViewListingContainer: React.FC<ViewListingContainerProps> = (
	props,
) => {
	const { listingId } = useParams();
	const {
		data: listingData,
		loading: listingLoading,
		error: listingError,
	} = useQuery(ViewListingDocument, {
		variables: { id: listingId },
		skip: !listingId,
		fetchPolicy: 'cache-first',
	});

	const { data: currentUserData, loading: currentUserLoading } = useQuery(
		ViewListingCurrentUserDocument,
		{
			skip: !props.isAuthenticated, // Skip if not authenticated
		},
	);

	const reserverId = currentUserData?.currentUser?.id ?? '';

	const skip = !reserverId || !listingId;
	const { data: userReservationData, loading: userReservationLoading } =
		useQuery(ViewListingActiveReservationRequestForListingDocument, {
			variables: { listingId: listingId ?? '', reserverId },
			skip,
		});

	const sharedTimeAgo = listingData?.itemListing?.createdAt
		? computeTimeAgo(listingData.itemListing.createdAt)
		: undefined;

	const userIsSharer = false;
	const isAdmin = currentUserData?.currentUser?.userIsAdmin ?? false;

	// Check if listing is blocked and user is not admin
	const isBlocked = listingData?.itemListing?.state === 'Blocked';
	const cannotViewBlockedListing = isBlocked && !isAdmin;

	return (
		<ComponentQueryLoader
			loading={userReservationLoading || listingLoading || currentUserLoading}
			error={listingError}
			errorComponent={<div>Error loading listing.</div>}
			hasData={cannotViewBlockedListing ? null : listingData?.itemListing}
			noDataComponent={
				cannotViewBlockedListing ? (
					<div
						style={{
							textAlign: 'center',
							padding: '50px 20px',
							maxWidth: '600px',
							margin: '0 auto',
						}}
					>
						<h2>Listing Not Available</h2>
						<p>This listing is currently not available.</p>
					</div>
				) : undefined
			}
			hasDataComponent={
				<ViewListing
					listing={listingData?.itemListing as ItemListing}
					userIsSharer={userIsSharer}
					isAuthenticated={props.isAuthenticated}
					currentUserId={reserverId}
					sharedTimeAgo={sharedTimeAgo}
					userReservationRequest={
						userReservationData?.myActiveReservationForListing
					}
					isAdmin={isAdmin}
				/>
			}
		/>
	);
};
