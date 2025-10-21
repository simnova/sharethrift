import { ListingsPageContainer } from "../components/listings-page.container.tsx";
import { useAuth } from "react-oidc-context";

interface ListingsProps {
  isAuthenticated?: boolean; // use for mock/testing purposes
}

export const Listings: React.FC<ListingsProps> = ({ isAuthenticated }) => {
  const auth = useAuth();
  const isUserAuthenticated = isAuthenticated ?? auth.isAuthenticated;
  return <ListingsPageContainer isAuthenticated={isUserAuthenticated} />;
};
