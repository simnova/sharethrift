import { CreateListingContainer } from '../components/create-listing/create-listing.container.tsx';
import { useAuth } from 'react-oidc-context';

interface CreateListingProps {
	isAuthenticated?: boolean; // use for mock/testing purposes
}

export const CreateListing: React.FC<CreateListingProps> = ({ isAuthenticated }) => {
	const auth = useAuth();
	const isUserAuthenticated = isAuthenticated ?? auth.isAuthenticated;
	return <CreateListingContainer isAuthenticated={isUserAuthenticated} />;
};
