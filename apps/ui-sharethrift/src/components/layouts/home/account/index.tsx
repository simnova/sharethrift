import { Route, Routes } from 'react-router-dom';
import { Profile } from './profile/pages/profile.tsx';
import { Settings } from './settings/pages/settings.tsx';

export const AccountRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="profile" element={<Profile />} />
			<Route path="settings" element={<Settings />} />
		</Routes>
	);
};
