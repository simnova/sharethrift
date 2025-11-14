import { Route, Routes } from 'react-router-dom';
import { Profile } from './profile/pages/Profile.tsx';
import { Settings } from './settings/pages/Settings.tsx';

export const AccountRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="profile" element={<Profile />} />
			<Route path="settings" element={<Settings />} />
		</Routes>
	);
};
