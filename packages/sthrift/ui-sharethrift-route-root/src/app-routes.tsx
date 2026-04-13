import { Route, Routes } from 'react-router-dom';
import { SectionLayout } from './section-layout.tsx';
import { RequireAuth } from '@sthrift/ui-sharethrift-route-shared';
import { Listings } from './components/pages/home/pages/all-listings-page.tsx';
import { ViewListing } from './components/pages/view-listing/pages/view-listing-page.tsx';
import { CreateListing } from './components/pages/create-listing/pages/create-listing-page.tsx';
import { MyListingsRoutes } from './components/pages/my-listings/index.tsx';
import { MyReservationsRoutes } from './components/pages/my-reservations/index.tsx';
import { MessagesRoutes } from './components/pages/messages/index.tsx';
import { AccountRoutes } from './components/pages/account/index.tsx';

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
			</Route>
		</Routes>
	);
};
