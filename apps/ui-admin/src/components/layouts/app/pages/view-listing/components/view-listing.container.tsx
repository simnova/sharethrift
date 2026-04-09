import { useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-shared';
import { useParams } from 'react-router-dom';
import {
	type ItemListing,
	ViewListingCurrentAdminUserDocument,
	ViewListingDocument,
} from '../../../../../../generated.tsx';
import { ViewListing } from './view-listing.tsx';

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
		data: currentAdminUserData,
		loading: currentAdminUserLoading,
	} = useQuery(ViewListingCurrentAdminUserDocument, {
		skip: !props.isAuthenticated, // Skip if not authenticated
	});

	const reserverId = currentAdminUserData?.currentAdminUser?.id ?? '';

	const sharedTimeAgo = listingData?.itemListing?.createdAt
		? computeTimeAgo(listingData.itemListing.createdAt)
		: undefined;

	return (
		<ComponentQueryLoader
			loading={listingLoading || currentAdminUserLoading}
			error={listingError}
			errorComponent={<div>Error loading listing.</div>}
			hasData={listingData?.itemListing}
			hasDataComponent={
				<ViewListing
					listing={listingData?.itemListing as ItemListing}
					currentUserId={reserverId}
					sharedTimeAgo={sharedTimeAgo}
				/>
			}
		/>
	);
};
