import { useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useParams } from 'react-router-dom';
import {
	type ItemListing,
	ViewListingActiveReservationRequestForListingDocument,
	ViewListingCurrentUserDocument,
	ViewListingDocument,
	ViewListingAppealRequestByListingIdDocument,
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

	const {
		data: currentUserData,
		loading: currentUserLoading,
	} = useQuery(ViewListingCurrentUserDocument, {
		skip: !props.isAuthenticated, // Skip if not authenticated
	});

	const reserverId = currentUserData?.currentUser?.id ?? '';

	const skip = !reserverId || !listingId;
	const {
		data: userReservationData,
		loading: userReservationLoading,
	} = useQuery(ViewListingActiveReservationRequestForListingDocument, {
		variables: { listingId: listingId ?? '', reserverId },
		skip,
	});

	// Fetch appeal request for blocked listing
	const {
		data: appealRequestData,
		loading: appealRequestLoading,
		refetch: refetchAppealRequest,
	} = useQuery(ViewListingAppealRequestByListingIdDocument, {
		variables: { listingId: listingId ?? '' },
		skip: !listingId,
		fetchPolicy: 'network-only',
	});

	const sharedTimeAgo = listingData?.itemListing?.createdAt
		? computeTimeAgo(listingData.itemListing.createdAt)
		: undefined;

	const userIsSharer = false;
	return (
		<ComponentQueryLoader
			loading={userReservationLoading || listingLoading || currentUserLoading || appealRequestLoading}
			error={listingError}
			errorComponent={<div>Error loading listing.</div>}
			hasData={listingData?.itemListing}
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
					appealRequest={appealRequestData?.getListingAppealRequestByListingId}
					onAppealRequestSuccess={refetchAppealRequest}
				/>
			}
		/>
	);
};
