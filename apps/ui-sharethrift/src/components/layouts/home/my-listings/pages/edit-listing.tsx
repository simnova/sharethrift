import { EditListingContainer } from '../../components/edit-listing/edit-listing.container.tsx';
import { useAuth } from 'react-oidc-context';

export const EditListing: React.FC = () => {
	const auth = useAuth();
	const isUserAuthenticated = auth?.isAuthenticated ?? false;
	return <EditListingContainer isAuthenticated={isUserAuthenticated} />;
};
