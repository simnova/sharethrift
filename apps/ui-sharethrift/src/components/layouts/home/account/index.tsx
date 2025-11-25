import { Route, Routes } from 'react-router-dom';
import { Profile } from './profile/pages/Profile.tsx';
import { Settings } from './settings/pages/Settings.tsx';
import { ViewUserProfileContainer } from './profile/components/view-user-profile.container.tsx';

export const AccountRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="profile" element={<Profile />} />
			<Route path="profile/:userId" element={<ViewUserProfileContainer />} />
			<Route path="settings" element={<Settings />} />
		</Routes>
	);
};
