import { Route, Routes } from 'react-router-dom';
import { AccountRoutes } from './account/Index.tsx';
import { MessagesRoutes } from './messages/Index.tsx';
import { MyListingsRoutes } from './my-listings/Index.tsx';
import { MyReservationsRoutes } from './my-reservations/Index.tsx';
import { Listings } from './pages/all-listings-page.tsx';
import { ViewListing } from './pages/view-listing-page.tsx';
import { CreateListing } from './pages/create-listing-page.tsx';
import { SectionLayout } from './section-layout.tsx';
import { AdminDashboardMain } from './account/admin-dashboard/pages/admin-dashboard-main.tsx';
import { RequireAuth } from '../../shared/require-auth.tsx';
import { RequireAuthAdmin } from '../../shared/require-auth-admin.tsx';

export const HomeRoutes: React.FC = () => {
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
