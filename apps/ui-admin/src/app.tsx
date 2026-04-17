import { Route, Routes } from 'react-router-dom';
import {
	AppRoutes,
	AdminLogin,
	AuthRedirect,
} from '@sthrift/ui-admin-route-root';
import { ListingOperationsRoutes } from '@sthrift/ui-admin-route-listing-operations';
import { RequireAuth } from '@sthrift/ui-admin-route-shared';
import { UserOperationsRoutes } from '@sthrift/ui-admin-route-user-operations';
import type React from 'react';

const appSection = (
	<RequireAuth redirectPath="/login">
		<AppRoutes />
	</RequireAuth>
);

const listingOperationsSection = (
	<RequireAuth redirectPath="/login">
		<ListingOperationsRoutes />
	</RequireAuth>
);

const userOperationsSection = (
	<RequireAuth redirectPath="/login">
		<UserOperationsRoutes />
	</RequireAuth>
);

export const App: React.FC = () => {
	return (
		<Routes>
			<Route path="/*" element={appSection} />
			<Route path="/login" element={<AdminLogin />} />
			<Route path="/auth-redirect" element={<AuthRedirect />} />
			<Route
				path="/admin-listing-operations/*"
				element={listingOperationsSection}
			/>
			<Route path="/admin-user-operations/*" element={userOperationsSection} />
		</Routes>
	);
};
