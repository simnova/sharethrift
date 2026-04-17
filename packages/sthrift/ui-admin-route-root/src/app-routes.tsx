import { Route, Routes } from 'react-router-dom';
import { SectionLayout } from './section-layout.tsx';
import { Listings } from './components/pages/home/pages/all-listings-page.tsx';
import { ViewListing } from './components/pages/view-listing/pages/view-listing-page.tsx';
import { MessagesRoutes } from './components/pages/messages/index.tsx';

export const AppRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="" element={<SectionLayout />}>
				<Route path="" element={<Listings />} />
				<Route path="listing/:listingId" element={<ViewListing />} />
				<Route path="messages/*" element={<MessagesRoutes />} />
			</Route>
		</Routes>
	);
};
