import { AdminViewListing } from '../account/admin-dashboard/components/admin-listings-table/admin-listings-table.view-listing.tsx';
import type { ReactElement } from 'react';

export default function ViewListing(): ReactElement {
	// Always open the admin view for now per request.
	return <AdminViewListing />;
}
