import { ReservationsView } from './reservations-view';
import type { ReservationRequest } from '../pages/my-reservations';
//import { useQuery, useMutation } from '@apollo/client';

export const MOCK_ACTIVE_RESERVATIONS: ReservationRequest[] = [
  {
    id: '1',
    state: 'REQUESTED',
    reservationPeriodStart: '2025-08-15',
    reservationPeriodEnd: '2025-08-20',
    createdAt: '2025-08-10',
    updatedAt: '2025-08-10',
    listingId: 'listing1',
    reserverId: 'user1',
    closeRequested: false,
    listing: {
      id: 'listing1',
      title: 'Canon EOS R5 Camera',
      imageUrl: 'https://cdn.citymapia.com/kottayam/canon-image-square/16939/Portfolio.jpg?width=400&biz=2881&v=20191029082248'
    },
    reserver: {
      id: 'user1',
      firstName: 'Alice',
      lastName: 'Johnson',
      name: 'Alice Johnson'
    }
  },
  {
    id: '2',
    state: 'ACCEPTED',
    reservationPeriodStart: '2025-08-22',
    reservationPeriodEnd: '2025-08-25',
    createdAt: '2025-08-12',
    updatedAt: '2025-08-13',
    listingId: 'listing2',
    reserverId: 'user2',
    closeRequested: false,
    listing: {
      id: 'listing2',
      title: 'Shure SM7B Microphone',
      imageUrl: 'https://traceaudio.com/cdn/shop/products/NewSM7BwithAnserModcopy_1200x1200.jpg?v=1662083374'
    },
    reserver: {
      id: 'user2',
      firstName: 'Bob',
      lastName: 'Smith',
      name: 'Bob Smith'
    }
  },
];



export const ReservationsViewActiveContainer: React.FC = () => {


    // const [reservations, setReservations] = React.useState(MOCK_ACTIVE_RESERVATIONS);
    // const loading = false;
    // const error: string | null = null;
    // const cancelLoading = false;
    // const closeLoading = false;

    const onCancel = (reservationId: string) => {
        // mock: do nothing
        console.log('Cancel reservation', reservationId);
    };

    const onClose = (reservationId: string) => {
        // mock: do nothing
        console.log('Close reservation', reservationId);
    };

    const onMessage = (reservationId: string) => {
        // mock: do nothing
        console.log('Message for reservation', reservationId);
    };
  return (
    <ReservationsView
      reservations={MOCK_ACTIVE_RESERVATIONS}
      onCancel={onCancel}
      onClose={onClose}
      onMessage={onMessage}
      showActions={true}
      emptyText="No active reservations"
      loading={false} //temporarily literal values 
      error={null}
      cancelLoading={false}
      closeLoading={false}
    />
  );
};

export default ReservationsViewActiveContainer;
