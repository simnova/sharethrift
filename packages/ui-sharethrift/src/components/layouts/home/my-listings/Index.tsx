import { Routes, Route } from "react-router-dom";
import MyListingsMain from "./Main";
import EditListing from "./edit-listing";

export default function MyListingsRoutes() {
  return (
    <Routes>
      <Route path="user/:userId" element={<MyListingsMain />} />
      <Route path="user/:userId/:listingId/edit" element={<EditListing />} />
    </Routes>
  );
}
