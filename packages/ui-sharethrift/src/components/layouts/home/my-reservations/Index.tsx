import { Routes, Route, useParams } from "react-router-dom";
import { MyReservationsContainer } from "./pages/main.container";
import ViewRequest from "./pages/ViewRequest";

function MyReservationsMainWrapper() {
  const { userId } = useParams<{ userId: string }>();
  
  if (!userId) {
    return <div>User ID is required</div>;
  }
  
  return <MyReservationsContainer userId={userId} />;
}

export default function MyReservationsRoutes() {
  return (
    <Routes>
      <Route path="user/:userId" element={<MyReservationsMainWrapper />} />
      <Route path="user/:userId/reservation-request/:reservationId/view" element={<ViewRequest />} />
    </Routes>
  );
}
