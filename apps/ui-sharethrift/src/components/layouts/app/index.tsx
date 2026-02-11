import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SectionLayout } from './section-layout.tsx';
import { RequireAuth } from '../../shared/require-auth.tsx';
import { RequireAuthAdmin } from '../../shared/require-auth-admin.tsx';

// Route-level code splitting via dynamic imports
const Listings = lazy(() => import('./pages/home/pages/all-listings-page.tsx').then(m => ({ default: m.Listings })));
const ViewListing = lazy(() => import('./pages/view-listing/pages/view-listing-page.tsx').then(m => ({ default: m.ViewListing })));
const CreateListing = lazy(() => import('./pages/create-listing/pages/create-listing-page.tsx').then(m => ({ default: m.CreateListing })));
const MyListingsRoutes = lazy(() => import('./pages/my-listings/index.tsx').then(m => ({ default: m.MyListingsRoutes })));
const MyReservationsRoutes = lazy(() => import('./pages/my-reservations/index.tsx').then(m => ({ default: m.MyReservationsRoutes })));
const MessagesRoutes = lazy(() => import('./pages/messages/index.tsx').then(m => ({ default: m.MessagesRoutes })));
const AccountRoutes = lazy(() => import('./pages/account/index.tsx').then(m => ({ default: m.AccountRoutes })));
const AdminDashboardMain = lazy(() => import('./pages/admin-dashboard/pages/admin-dashboard-main.tsx').then(m => ({ default: m.AdminDashboardMain })));

export const AppRoutes: React.FC = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
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
		</Suspense>
	);
}