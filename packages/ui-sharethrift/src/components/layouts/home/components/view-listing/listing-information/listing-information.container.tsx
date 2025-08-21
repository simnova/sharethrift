import { ListingInformation } from './listing-information';
import { DUMMY_LISTINGS } from '../../mock-listings';
import type { ListingInformationProps } from './listing-information';

interface ListingInformationContainerProps {
  listingId: string;
  userRole: ListingInformationProps['userRole'];
  isAuthenticated: boolean;
  reservationRequestStatus?: ListingInformationProps['reservationRequestStatus'];
  onReserveClick?: () => void;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  className?: string;
}

export default function ListingInformationContainer({
  listingId,
  userRole,
  isAuthenticated,
  reservationRequestStatus,
  onReserveClick,
  onLoginClick,
  onSignUpClick,
  className
}: ListingInformationContainerProps) {
  // Find the correct listing from DUMMY_LISTINGS
  const listing = DUMMY_LISTINGS.find((l: typeof DUMMY_LISTINGS[number]) => l._id === listingId);
  if (!listing) return null;

  // Map ItemListing to ListingInformationProps.listing shape
  const mappedListing: ListingInformationProps['listing'] = {
    id: listing._id,
    title: listing.title,
    description: listing.description,
    category: listing.category,
    location: listing.location,
    status: listing.state === 'Published' ? 'Active' : 'Paused',
    availableFrom: listing.sharingPeriodStart?.toISOString().slice(0, 10) ?? '',
    availableTo: listing.sharingPeriodEnd?.toISOString().slice(0, 10) ?? '',
  };

  return (
    <ListingInformation
      listing={mappedListing}
      userRole={userRole}
      isAuthenticated={isAuthenticated}
      reservationRequestStatus={reservationRequestStatus}
      onReserveClick={onReserveClick}
      onLoginClick={onLoginClick}
      onSignUpClick={onSignUpClick}
      className={className}
    />
  );
}

