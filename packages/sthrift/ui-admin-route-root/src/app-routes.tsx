import { Route, Routes } from 'react-router-dom';
import { SectionLayout } from './section-layout.tsx';
import { RequireAuth } from './require-auth.tsx';
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
				<Route
					path="messages/*"
					element={
						<RequireAuth redirectPath="/">
							<MessagesRoutes />
						</RequireAuth>
					}
				/>
				<Route
					path="admin-dashboard"
					element={
						<RequireAuth redirectPath="/">
							<AdminDashboardMain />
						</RequireAuth>
					}
				/>
			</Route>
		</Routes>
	);
};
