import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
// Import the GraphQL document (Vite raw import if needed)
// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import ViewListingQuerySource from './view-listing.container.graphql?raw';
import { ViewListing } from './view-listing';

const VIEW_LISTING_QUERY = gql(ViewListingQuerySource);

export function ViewListingContainer({ isAuthenticated }: { readonly isAuthenticated: boolean }) {
  const { listingId } = useParams();
  const { data, loading, error } = useQuery(VIEW_LISTING_QUERY, {
    variables: { id: listingId },
    skip: !listingId,
    fetchPolicy: 'cache-first',
  });

  if (!listingId) return <div>Missing listing id.</div>;
  if (loading) return <div>Loading listing...</div>;
  if (error) return <div>Error loading listing.</div>;
  if (!data?.itemListing) return <div>Listing not found.</div>;

  // Map server model to existing ViewListingProps.listing shape expected by presentational component
  const listing = {
    _id: data.itemListing.id,
    id: data.itemListing.id,
    title: data.itemListing.title,
    description: data.itemListing.description,
    category: data.itemListing.category,
    location: data.itemListing.location,
    images: data.itemListing.images ?? [],
  sharingPeriodStart: data.itemListing.sharingPeriodStart ? new Date(data.itemListing.sharingPeriodStart) : new Date(),
  sharingPeriodEnd: data.itemListing.sharingPeriodEnd ? new Date(data.itemListing.sharingPeriodEnd) : new Date(),
    // Fields not yet provided by backend; use placeholders / derive
    price: undefined,
    priceUnit: undefined,
    condition: undefined,
    itemName: data.itemListing.title,
    availableFrom: data.itemListing.sharingPeriodStart,
    availableTo: data.itemListing.sharingPeriodEnd,
    status: data.itemListing.state,
    sharer: data.itemListing.sharer,
  } as const;

  const sharedTimeAgo = data.itemListing.createdAt
    ? computeTimeAgo(data.itemListing.createdAt)
    : undefined;

  return (
    <ViewListing
      listing={listing}
      userRole={isAuthenticated ? 'sharer' : 'logged-out'}
      isAuthenticated={isAuthenticated}
      currentUserId={isAuthenticated ? listing.sharer : undefined}
      sharedTimeAgo={sharedTimeAgo}
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