import { Route, Routes } from 'react-router-dom';
import { SectionLayout } from './section-layout.tsx';
import { RequireAuth } from './require-auth.tsx';
import { Listings } from './components/pages/home/pages/all-listings-page.tsx';
import { ViewListing } from './components/pages/view-listing/pages/view-listing-page.tsx';
import { MessagesRoutes } from './components/pages/messages/index.tsx';
import { AdminListingOperationsPage } from './components/pages/admin-listing-operations/pages/admin-listing-operations-page.tsx';
import { AdminUserOperationsPage } from './components/pages/admin-user-operations/pages/admin-user-operations-page.tsx';

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
					path="admin-listing-operations"
					element={
						<RequireAuth redirectPath="/">
							<AdminListingOperationsPage />
						</RequireAuth>
					}
				/>
				<Route
					path="admin-user-operations"
					element={
						<RequireAuth redirectPath="/">
							<AdminUserOperationsPage />
						</RequireAuth>
					}
				/>
			</Route>
		</Routes>
	);
};
