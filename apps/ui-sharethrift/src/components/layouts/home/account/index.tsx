import { Route, Routes } from 'react-router-dom';
import EditSettings from './pages/EditSettings';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function AccountRoutes() {
  return (
    <Routes>
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="settings/edit" element={<EditSettings />} />
    </Routes>
  );
}
