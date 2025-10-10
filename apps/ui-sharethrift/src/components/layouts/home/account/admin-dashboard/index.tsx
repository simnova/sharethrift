import { Routes, Route } from 'react-router-dom';
import AdminDashboardMain from './pages/admin-dashboard-main.tsx';

export default function AdminDashboardRoutes() {
	return (
		<Routes>
			<Route path="" element={<AdminDashboardMain />} />
		</Routes>
	);
}
