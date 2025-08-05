import { Routes, Route } from "react-router-dom";

import AdminDashboardMain from "./Main";
import AdminListings from "./Listings";
import AdminUsers from "./Users";

export default function AdminDashboardRoutes() {
  return (
    <Routes>
      <Route path="" element={<AdminDashboardMain />} />
      <Route path="listings" element={<AdminListings />} />
      <Route path="users" element={<AdminUsers />} />
    </Routes>
  );
}
