import { ViewListingContainer } from "../components/view-listing.container.tsx";
import { useAuth } from "react-oidc-context";

export const ViewListing: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // Pass required prop to fix TS2741
  return <ViewListingContainer isAuthenticated={isAuthenticated} />;
};
