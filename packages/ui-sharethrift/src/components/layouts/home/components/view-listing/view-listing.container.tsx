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
    type ViewListingQueryVariables
} from '../../../../../generated';


export function ViewListingContainer({ isAuthenticated }: { readonly isAuthenticated: boolean }) {
  const { listingId } = useParams();
  const { data: listingData, loading: listingLoading, error: listingError } = useQuery<ViewListingQuery, ViewListingQueryVariables>(ViewListingDocument, {
    variables: { id: listingId },
    skip: !listingId,
    fetchPolicy: 'cache-first',
  });

  const { data: currentUserData } = useQuery<ViewListingCurrentUserQuery>(ViewListingCurrentUserDocument);

  const reservationRequestStatus = null; // Placeholder until integrated

  if (!listingId) return <div>Missing listing id.</div>;
  if (listingLoading) return <div>Loading listing...</div>;
  if (listingError) return <div>Error loading listing.</div>;
  if (!listingData?.itemListing) return <div>Listing not found.</div>;

  // Temporary debug logs
  if (!currentUserData?.currentPersonalUserAndCreateIfNotExists) {console.log("Current user could not be created or not found:");}
//   if (currentUserError) { return <div>Error loading current user data.</div>; }
//   if (currentUserLoading) { return <div>Loading current user data...</div> }

  // Map server model to existing ViewListingProps.listing shape expected by presentational component
  const listing = {
    _id: listingData.itemListing.id,
    id: listingData.itemListing.id,
    title: listingData.itemListing.title,
    description: listingData.itemListing.description,
    category: listingData.itemListing.category,
    location: listingData.itemListing.location,
    images: listingData.itemListing.images ?? [],
  sharingPeriodStart: listingData.itemListing.sharingPeriodStart ? new Date(listingData.itemListing.sharingPeriodStart) : new Date(),
  sharingPeriodEnd: listingData.itemListing.sharingPeriodEnd ? new Date(listingData.itemListing.sharingPeriodEnd) : new Date(),
    // Fields not yet provided by backend; use placeholders / derive
    price: undefined,
    priceUnit: undefined,
    condition: undefined,
    itemName: listingData.itemListing.title,
    availableFrom: listingData.itemListing.sharingPeriodStart,
    availableTo: listingData.itemListing.sharingPeriodEnd,
    status: listingData.itemListing.state,
    sharer: listingData.itemListing.sharer,
  } as const;

  const sharedTimeAgo = listingData.itemListing.createdAt
    ? computeTimeAgo(listingData.itemListing.createdAt)
    : undefined;

  const userRole = currentUserData?.currentPersonalUserAndCreateIfNotExists.id === listingData.itemListing.sharer ? 'sharer' : 'reserver';
  return (
    <ViewListing
      listing={listing}
      userRole={userRole}
      isAuthenticated={isAuthenticated}
      currentUserId={isAuthenticated ? listing.sharer : undefined}
      sharedTimeAgo={sharedTimeAgo}
      reservationRequestStatus={reservationRequestStatus}
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