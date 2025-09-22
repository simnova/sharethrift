import { CreateListingContainer } from '../components/create-listing/create-listing.container';
import { useAuth } from 'react-oidc-context';

interface CreateListingProps {
	isAuthenticated?: boolean; // use for mock/testing purposes
}

export default function CreateListing({ isAuthenticated }: CreateListingProps) {
	const auth = useAuth();
	const isUserAuthenticated = isAuthenticated ?? auth.isAuthenticated;

	return <CreateListingContainer isAuthenticated={isUserAuthenticated} />;
}
