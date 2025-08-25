import { useParams } from 'react-router-dom';
import { DUMMY_LISTINGS } from '../mock-listings';
import { ViewListing } from './view-listing';
// ...existing code...



export function ViewListingContainer({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { listingId } = useParams();
  const listing = DUMMY_LISTINGS.find(l => l._id === listingId);
  if (!listing) return <div>Listing not found.</div>;
  return (
    <ViewListing
      listing={listing}
      userRole={isAuthenticated ? 'sharer' : 'logged-out'}
      isAuthenticated={isAuthenticated}
      currentUserId={isAuthenticated ? listing.sharer : undefined}
      sharedTimeAgo={"2 days ago"}
    />
  );
}