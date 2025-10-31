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

	const {
		data: currentUserData,
		loading: currentUserLoading,
		error: currentUserError,
	} = useQuery(ViewListingCurrentUserDocument);

	const reserverId =
		currentUserData?.currentPersonalUserAndCreateIfNotExists?.id ?? '';

	const skip = !reserverId || !listingId;
	const {
		data: userReservationData,
		loading: userReservationLoading,
		error: userReservationError,
	} = useQuery(ViewListingActiveReservationRequestForListingDocument, {
		variables: { listingId: listingId ?? '', reserverId },
		skip,
	});

	const sharedTimeAgo = listingData?.itemListing?.createdAt
		? computeTimeAgo(listingData.itemListing.createdAt)
		: undefined;

	const userIsSharer = false;
	return (
		<ComponentQueryLoader
			loading={userReservationLoading || listingLoading || currentUserLoading}
			error={userReservationError || listingError || currentUserError}
			errorComponent={<div>Error loading user reservation.</div>}
			hasData={
				listingData?.itemListing &&
				currentUserData?.currentPersonalUserAndCreateIfNotExists
			}
			hasDataComponent={
				<ViewListing
					listing={listingData?.itemListing as ItemListing}
					userIsSharer={userIsSharer}
					isAuthenticated={props.isAuthenticated}
					sharedTimeAgo={sharedTimeAgo}
					userReservationRequest={
						userReservationData?.myActiveReservationForListing
					}
				/>
			}
		/>
	);
};
