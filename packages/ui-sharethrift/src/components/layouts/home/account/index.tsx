import { Route, Routes } from 'react-router-dom';
import EditSettings from './EditSettings';
import AccountMain from './Main';
import Profile from './Profile';
import Settings from './Settings';

export default function AccountRoutes() {
  return (
    <Routes>
      <Route path="" element={<AccountMain />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="settings/edit" element={<EditSettings />} />
    </Routes>
  );
}
