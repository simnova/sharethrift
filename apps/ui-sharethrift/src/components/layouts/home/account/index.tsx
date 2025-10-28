import { Route, Routes } from 'react-router-dom';
import { EditSettings } from './settings/pages/EditSettings.tsx';
import { Profile } from './profile/pages/Profile.tsx';
import { Settings } from './settings/pages/Settings.tsx';
import { AdminDashboardMain } from './admin-dashboard/pages/admin-dashboard-main.tsx';
import { useUserIsAdmin } from './hooks/useUserType.ts';

export const AccountRoutes: React.FC = () => {
	const { isAdmin, loading } = useUserIsAdmin();

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<Routes>
			<Route path="profile" element={<Profile />} />
			<Route path="settings" element={<Settings />} />
			<Route path="settings/edit" element={<EditSettings />} />
			{isAdmin && (
				<Route
					path="admin-dashboard"
					element={<AdminDashboardMain />}
				/>
			)}
		</Routes>
	);
};
