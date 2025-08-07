import { Routes, Route } from "react-router-dom";

import AdminListings from "./pages/Listings";
import AdminUsers from "./pages/Users";

export default function AdminDashboardRoutes() {
  return (
    <Routes>
      <Route path="listings" element={<AdminListings />} />
      <Route path="users" element={<AdminUsers />} />
    </Routes>
  );
}
