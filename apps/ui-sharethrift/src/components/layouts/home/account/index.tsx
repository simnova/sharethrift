import { Route, Routes } from 'react-router-dom';
import EditSettings from './settings/pages/EditSettings.tsx';
import Profile from './profile/pages/Profile.tsx';
import Settings from './settings/pages/Settings.tsx';
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
