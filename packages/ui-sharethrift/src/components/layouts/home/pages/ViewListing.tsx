import { ViewListingContainer } from '../components/view-listing/view-listing.container';

export default function ViewListing() {
  // Pass required prop to fix TS2741
  return <ViewListingContainer isAuthenticated={false} />;
}
