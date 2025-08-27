import { ReservationsViewHistoryContainer } from '../components/reservations-view-history.container.tsx';

export interface MyReservationsMainProps {
  userId?: string; 
}

export const MyReservationsHistory: React.FC = () => {

  return (
    <ReservationsViewHistoryContainer />
  );
}

export default MyReservationsHistory;
