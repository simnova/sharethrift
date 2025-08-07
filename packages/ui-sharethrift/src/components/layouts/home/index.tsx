
import { Route, Routes } from "react-router-dom";
import AccountRoutes from "./account";
import AdminDashboardRoutes from "./admin-dashboard";
import MyReservationsRoutes from "./my-reservations/Index";
import Listings from "./components/Listings";
import HomeTabsLayout from "./section-layout";
import MessagesRoutes from "./messages";
import MyListingsRoutes from "./my-listings";


export default function HomeRoutes() {
  return (
    <Routes>
        <Route path="" element={<HomeTabsLayout />} >
            <Route path="home/*" element={<Listings />} />
            <Route path="my-listings/*" element={<MyListingsRoutes />} />
            <Route path="my-reservations/*" element={<MyReservationsRoutes />} />
            <Route path="messages/*" element={<MessagesRoutes />} />
            <Route path="account/*" element={<AccountRoutes />} />
            <Route path="admin-dashboard/*" element={<AdminDashboardRoutes />} />
        </Route>
    </Routes>
  );
}
