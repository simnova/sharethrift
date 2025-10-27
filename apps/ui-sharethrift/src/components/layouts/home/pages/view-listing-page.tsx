import { ViewListingContainer } from '../components/view-listing/view-listing.container.tsx';
import { AdminViewListing } from '../account/admin-dashboard/components/admin-listings-table/admin-listings-table.view-listing.tsx';
import { useAuth } from 'react-oidc-context';

export default function ViewListing() {
	const { isAuthenticated } = useAuth();
	// Placeholder admin check — replace with real server/auth-based permission check.
	// Using sessionStorage for admin checks is unsafe and may conflict with centralized
	// permissions; keep this false until a proper permission system is in place.
	const isAdminContext = false; // TODO: implement proper admin permission checks

	// If viewing as admin, use the admin view (currently disabled by placeholder)
	if (isAdminContext) {
		return <AdminViewListing />;
	}

	// Otherwise use the regular user view
	return <ViewListingContainer isAuthenticated={isAuthenticated} />;
}
