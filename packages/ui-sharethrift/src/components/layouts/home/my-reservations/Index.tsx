import { Routes, Route } from "react-router-dom";
import MyReservationsMain from "./Main";
import ViewRequest from "./ViewRequest";

export default function MyReservationsRoutes() {
  return (
    <Routes>
      <Route path="user/:userId" element={<MyReservationsMain />} />
      <Route path="user/:userId/reservation-request/:reservationId/view" element={<ViewRequest />} />
    </Routes>
  );
}
