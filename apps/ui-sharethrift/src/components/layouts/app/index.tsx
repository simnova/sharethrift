import { Route, Routes } from 'react-router-dom';
import { AccountRoutes } from './pages/account/index.tsx';
import { MessagesRoutes } from './pages/messages/index.tsx';
import { MyListingsRoutes } from './pages/my-listings/index.tsx';
import { MyReservationsRoutes } from './pages/my-reservations/index.tsx';
import { Listings } from './pages/home/pages/all-listings-page.tsx';
import { ViewListing } from './pages/view-listing/pages/view-listing-page.tsx';
import { CreateListing } from './pages/create-listing/pages/create-listing-page.tsx';
import { SectionLayout } from './section-layout.tsx';
import { AdminDashboardMain } from './pages/admin-dashboard/pages/admin-dashboard-main.tsx';
import { RequireAuth } from '../../shared/require-auth.tsx';
import { RequireAuthAdmin } from '../../shared/require-auth-admin.tsx';

export const AppRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="" element={<SectionLayout />}>
                <Route path="" element={<Listings />} />
                <Route path="listing/:listingId" element={<ViewListing />} />
                <Route path="create-listing" element={<RequireAuth redirectPath="/"><CreateListing /></RequireAuth>} />
                <Route path="my-listings/*" element={<RequireAuth redirectPath="/"><MyListingsRoutes /></RequireAuth>} />
                <Route path="my-reservations/*" element={<RequireAuth redirectPath="/"><MyReservationsRoutes /></RequireAuth>} />
                <Route path="messages/*" element={<RequireAuth redirectPath="/"><MessagesRoutes /></RequireAuth>} />
                <Route path="account/*" element={<RequireAuth redirectPath="/"><AccountRoutes /></RequireAuth>} />
                <Route path="admin-dashboard" element={<RequireAuthAdmin redirectPath="/"><AdminDashboardMain /></RequireAuthAdmin>} />
			</Route>
		</Routes>
	);
}
