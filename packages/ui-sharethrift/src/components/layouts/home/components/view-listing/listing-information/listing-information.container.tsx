import { useQuery, gql } from '@apollo/client';
import { ListingInformation } from './listing-information';
import type { ListingInformationProps, ListingStatus } from './listing-information';

const GET_LISTING_INFORMATION = gql`
  query ViewListingInformationGetListing($listingId: ObjectID!) {
    itemListing(id: $listingId) {
      id
      title
      description
      category
      location
      sharingPeriodStart
      sharingPeriodEnd
      state
    }
  }
`;

interface ItemListing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  state: string;
  sharingPeriodStart: string;
  sharingPeriodEnd: string;
}

interface ListingQueryResponse {
  itemListing: ItemListing;
}

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

// Map backend ItemListingState to frontend ListingStatus
function mapListingStateToStatus(state: string): ListingStatus {
  switch (state) {
    case 'Published':
      return 'Active';
    case 'Paused':
      return 'Paused';
    case 'Blocked':
      return 'Blocked';
    case 'Cancelled':
      return 'Cancelled';
    case 'Expired':
      return 'Expired';
    case 'Drafted':
      return 'Cancelled'; 
    case 'Appeal_Requested':
      return 'Blocked'; 
    default:
      return 'Active'; 
  }
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
  const { data, loading, error } = useQuery<ListingQueryResponse>(
    GET_LISTING_INFORMATION,
    {
      variables: { listingId },
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading listing information</div>;
  if (!data?.itemListing) return <div>Listing not found</div>;

  // Map backend ItemListing to ListingInformationProps.listing shape
  const mappedListing: ListingInformationProps['listing'] = {
    id: data.itemListing.id,
    title: data.itemListing.title,
    description: data.itemListing.description,
    category: data.itemListing.category,
    location: data.itemListing.location,
    status: mapListingStateToStatus(data.itemListing.state),
    availableFrom: new Date(data.itemListing.sharingPeriodStart).toISOString().slice(0, 10),
    availableTo: new Date(data.itemListing.sharingPeriodEnd).toISOString().slice(0, 10),
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

