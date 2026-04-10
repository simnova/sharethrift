import { ViewListing as SharedViewListing } from '@sthrift/ui-shared';
import { ListingImageGalleryContainer } from './listing-image-gallery/listing-image-gallery.container.tsx';
import { SharerInformationContainer } from './sharer-information/sharer-information.container.tsx';
import { ListingInformationContainer } from './listing-information/listing-information.container.tsx';
import type {
	ItemListing,
	ViewListingActiveReservationRequestForListingQuery,
} from '../../../../../../generated.tsx';

interface ViewListingProps {
	listing: ItemListing;
	userIsSharer: boolean;
	isAuthenticated: boolean;
	currentUserId?: string | null;
	userReservationRequest:
		| ViewListingActiveReservationRequestForListingQuery['myActiveReservationForListing']
		| null;
	sharedTimeAgo?: string;
}

export const ViewListing: React.FC<ViewListingProps> = ({
	listing,
	userIsSharer,
	isAuthenticated,
	currentUserId,
	userReservationRequest,
	sharedTimeAgo,
}) => {
	const sharer = listing.sharer;

	return (
		<>
			<SharedViewListing
				listing={listing}
				currentUserId={currentUserId}
				sharedTimeAgo={sharedTimeAgo}
				sharerInfoSlot={
					<SharerInformationContainer
						sharerId={sharer?.id}
						listingId={listing.id}
						isOwner={sharer?.id === currentUserId}
						className="sharer-info-responsive"
						sharedTimeAgo={sharedTimeAgo}
						currentUserId={currentUserId}
					/>
				}
				imageGallerySlot={
					<ListingImageGalleryContainer
						listingId={listing.id}
						className="listing-gallery-responsive"
					/>
				}
				listingInfoSlot={
					<ListingInformationContainer
						listing={listing}
						userIsSharer={userIsSharer}
						isAuthenticated={isAuthenticated}
						userReservationRequest={userReservationRequest}
						className="listing-info-responsive"
					/>
				}
			/>
			{/* TODO: Add login modal here for unauthenticated users attempting to reserve a listing. */}
		</>
	);
};
