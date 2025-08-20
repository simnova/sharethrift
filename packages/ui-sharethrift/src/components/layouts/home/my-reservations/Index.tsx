import { Routes, Route, useParams } from "react-router-dom";
import { MyReservationsContainer } from "./pages/main.container";

function MyReservationsMainWrapper() {
  const { userId } = useParams<{ userId: string }>();
  return <MyReservationsContainer userId={userId} />;
}

export default function MyReservationsRoutes() {
  return (
    <Routes>
      <Route path="" element={<MyReservationsMainWrapper />} /> {/*Here for show purposes*/}
      <Route path="user/:userId" element={<MyReservationsMainWrapper />} />
    </Routes>
  );
}
