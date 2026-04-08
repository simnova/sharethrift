import { Route, Routes } from 'react-router-dom';
import { SectionLayout } from './section-layout.tsx';
import { RequireAuthAdmin } from '../../shared/require-auth-admin.tsx';
import { Listings } from './pages/home/pages/all-listings-page.tsx';
import { ViewListing } from './pages/view-listing/pages/view-listing-page.tsx';
import { MessagesRoutes } from './pages/messages/index.tsx';
import { AdminDashboardMain } from './pages/admin-dashboard/pages/admin-dashboard-main.tsx';

export const AppRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="" element={<SectionLayout />}>
				<Route path="" element={<Listings />} />
				<Route path="listing/:listingId" element={<ViewListing />} />
				<Route path="messages/*" element={<RequireAuthAdmin redirectPath="/"><MessagesRoutes /></RequireAuthAdmin>} />
				<Route path="admin-dashboard" element={<RequireAuthAdmin redirectPath="/"><AdminDashboardMain /></RequireAuthAdmin>} />
			</Route>
		</Routes>
	);
}
