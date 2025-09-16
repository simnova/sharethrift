import { ListingsPageContainer } from '../components/listings-page.container';
import { useAuth } from 'react-oidc-context';

interface ListingsProps {
	readonly isAuthenticated?: boolean; // use for mock/testing purposes
}

export default function Listings({ isAuthenticated }: ListingsProps) {
	const auth = useAuth();
	const isUserAuthenticated = isAuthenticated ?? auth.isAuthenticated;

	return <ListingsPageContainer isAuthenticated={isUserAuthenticated} />;
}
