import { Tabs, Typography } from 'antd';
import styles from './my-reservations.module.css';
import { MyReservationsHistory } from './my-reservations-history.tsx';
import { MyReservationsActive } from './my-reservations-active.tsx';

const { Title } = Typography;

//Will eventually come from the generated graphql files
export interface ReservationRequest {
  id: string;
  state: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'RESERVATION_PERIOD' | 'CANCELLED';
  reservationPeriodStart: string;
  reservationPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
  listingId: string;
  reserverId: string;
  closeRequested: boolean;
  listing: {
    id: string;
    title: string;
    imageUrl: string;
  };
  reserver: {
    id: string;
    firstName: string;
    lastName: string;
    name?: string;
  };
}

export interface MyReservationsMainProps {
  userId?: string; 
}

export const MyReservationsMain: React.FC = () => {

  const tabItems = [
    {
      key: 'active',
      label: `Active Reservations`,
      children: <MyReservationsActive />,
    },
    {
      key: 'history',
      label: `Reservation History`,
      children: <MyReservationsHistory />,
    },
  ];
  return (
    <div className={`p-6 ${styles.mainContent}`}>
      <Title level={2} className={styles.pageTitle}>My Reservations</Title>
      <Tabs defaultActiveKey="active" items={tabItems} />
    </div>
  );
}

export default MyReservationsMain;