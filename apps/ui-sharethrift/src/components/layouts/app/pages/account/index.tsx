import { Route, Routes } from 'react-router-dom';
import { UserProfile } from './pages/profile/pages/UserProfile.tsx';
import { Profile } from './pages/profile/pages/profile.tsx';
import { Settings } from './pages/settings/pages/settings.tsx';

export const AccountRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="profile" element={<Profile />} />
			<Route path="profile/:userId" element={<UserProfile />} />
			<Route path="settings" element={<Settings />} />
		</Routes>
	);
};
