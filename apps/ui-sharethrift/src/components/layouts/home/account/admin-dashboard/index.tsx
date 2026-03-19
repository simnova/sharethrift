import { Routes, Route } from 'react-router-dom';
import { AdminDashboardMain } from './pages/admin-dashboard-main.tsx';

export const AdminDashboardRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="" element={<AdminDashboardMain />} />
		</Routes>
	);
};
