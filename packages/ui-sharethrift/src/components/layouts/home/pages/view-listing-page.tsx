import { ViewListingContainer } from '../components/view-listing/view-listing.container';
import { useAuth } from "react-oidc-context";

export default function ViewListing() {
  const { isAuthenticated } = useAuth();
  // Pass required prop to fix TS2741
  return <ViewListingContainer isAuthenticated={isAuthenticated} />;
}
