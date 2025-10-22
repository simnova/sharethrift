import { Route, Routes } from 'react-router-dom';
import { AccountRoutes } from './account/index.tsx';
import { MessagesRoutes } from './messages/Index.tsx';
import { MyListingsRoutes } from './my-listings/Index.tsx';
import { MyReservationsRoutes } from './my-reservations/Index.tsx';
import { Listings } from './pages/all-listings-page.tsx';
import ViewListing from './pages/view-listing-page.tsx';
import { CreateListing } from './pages/create-listing-page.tsx';
import { HomeTabsLayout } from './section-layout.tsx';

export const HomeRoutes: React.FC = () => {
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
			</Route>
		</Routes>
	);
}
