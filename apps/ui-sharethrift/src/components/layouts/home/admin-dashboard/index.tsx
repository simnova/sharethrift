import { Routes, Route } from 'react-router-dom';

import AdminListings from './pages/Listings.tsx';
import AdminUsers from './pages/Users.tsx';

export default function AdminDashboardRoutes() {
	return (
		<Routes>
			<Route path="listings" element={<AdminListings />} />
			<Route path="users" element={<AdminUsers />} />
		</Routes>
	);
}
