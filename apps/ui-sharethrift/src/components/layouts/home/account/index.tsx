import { Route, Routes } from "react-router-dom";
import { Profile } from "./profile/pages/Profile.tsx";
import { Settings } from "./settings/pages/Settings.tsx";
import { AdminDashboardMain } from "./admin-dashboard/pages/admin-dashboard-main.tsx";

export const AccountRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="admin-dashboard" element={<AdminDashboardMain />} />
    </Routes>
  );
};
