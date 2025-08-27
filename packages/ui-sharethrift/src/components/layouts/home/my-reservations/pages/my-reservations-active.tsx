import { ReservationsViewActiveContainer } from '../components/reservations-view-active.container.tsx';

export interface MyReservationsMainProps {
  userId?: string; 
}

export const MyReservationsActive: React.FC = () => {

  return (
    <ReservationsViewActiveContainer />
  );
}

export default MyReservationsActive;