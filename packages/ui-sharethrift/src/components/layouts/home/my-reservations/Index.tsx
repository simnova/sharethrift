import { Routes, Route, useParams } from "react-router-dom";
import { MyReservationsContainer } from "./pages/main.container";

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
    </Routes>
  );
}
