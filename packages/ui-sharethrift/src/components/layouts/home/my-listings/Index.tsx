import { Routes, Route } from "react-router-dom";
import MyListingsMain from "./pages/my-listings";
import EditListing from "./pages/edit-listing";

export default function MyListingsRoutes() {
  return (
    <Routes>
      <Route path="" element={<MyListingsMain />} />
      <Route path="user/:userId" element={<MyListingsMain />} />
      <Route path="user/:userId/:listingId/edit" element={<EditListing />} />
    </Routes>
  );
}
