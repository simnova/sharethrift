import { Route, Routes } from 'react-router-dom';
import AccountRoutes from './account';
import AdminDashboardRoutes from './admin-dashboard';
import MessagesRoutes from './messages/Index';
import MyListingsRoutes from './my-listings/Index';
import MyReservationsRoutes from './my-reservations/Index';
import Listings from './pages/all-listings-page';
import ViewListing from './pages/view-listing-page';
import CreateListing from './pages/create-listing-page';
import HomeTabsLayout from './section-layout';

export default function HomeRoutes() {
	return (
		<Routes>
			<Route path="" element={<HomeTabsLayout />}>
				<Route path="home" element={<Listings />} />
				<Route path="listing/:listingId" element={<ViewListing />} />
				<Route path="create-listing" element={<CreateListing />} />
				<Route path="my-listings/*" element={<MyListingsRoutes />} />
				<Route path="my-reservations/*" element={<MyReservationsRoutes />} />
				<Route path="messages/*" element={<MessagesRoutes />} />
				<Route path="account/*" element={<AccountRoutes />} />
				<Route path="admin-dashboard/*" element={<AdminDashboardRoutes />} />
			</Route>
		</Routes>
	);
}
