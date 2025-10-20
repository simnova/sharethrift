import { ViewListingContainer } from '../components/view-listing/view-listing.container.tsx';
import { AdminViewListing } from '../account/admin-dashboard/components/admin-view-listing.tsx';
import { useAuth } from 'react-oidc-context';

export default function ViewListing() {
	const { isAuthenticated } = useAuth();
	const isAdminContext = globalThis.sessionStorage?.getItem('adminContext') === 'true';
	
	// If viewing as admin, use the admin view
	if (isAdminContext) {
		return <AdminViewListing />;
	}
	
	// Otherwise use the regular user view
	return <ViewListingContainer isAuthenticated={isAuthenticated} />;
}
