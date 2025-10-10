import { Route, Routes } from 'react-router-dom';
import EditSettings from './pages/EditSettings.tsx';
import Profile from './pages/Profile.tsx';
import Settings from './pages/Settings.tsx';
import AdminDashboardMain from './admin-dashboard/pages/admin-dashboard-main.tsx';

export default function AccountRoutes() {
	return (
		<Routes>
			<Route path="profile" element={<Profile />} />
			<Route path="settings" element={<Settings />} />
			<Route path="settings/edit" element={<EditSettings />} />
			<Route path="admin-dashboard" element={<AdminDashboardMain />} />
		</Routes>
	);
}
