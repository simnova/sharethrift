import React from 'react';
//import { useQuery, useMutation } from '@apollo/client';
//import { MY_RESERVATIONS_QUERY, CANCEL_RESERVATION_MUTATION, CLOSE_RESERVATION_MUTATION } from './main.container.graphql';  //Will be updated to correct path
import MyReservationsMain from './Main';

export interface MyReservationsContainerProps {
  userId: string;
}

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

// Mock data for active reservations
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
      imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
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
      imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80'
    },
    reserver: {
      id: 'user2',
      firstName: 'Bob',
      lastName: 'Smith',
      name: 'Bob Smith'
    }
  },
];

// Mock data for history reservations
export const MOCK_HISTORY_RESERVATIONS: ReservationRequest[] = [
  {
    id: '3',
    state: 'CANCELLED',
    reservationPeriodStart: '2025-07-01',
    reservationPeriodEnd: '2025-07-05',
    createdAt: '2025-06-25',
    updatedAt: '2025-07-05',
    listingId: 'listing3',
    reserverId: 'user3',
    closeRequested: false,
    listing: {
      id: 'listing3',
      title: 'DJI Mavic Air 2 Drone',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
    },
    reserver: {
      id: 'user3',
      firstName: 'Charlie',
      lastName: 'Lee',
      name: 'Charlie Lee'
    }
  },
  {
    id: '4',
    state: 'RESERVATION_PERIOD',
    reservationPeriodStart: '2025-06-10',
    reservationPeriodEnd: '2025-06-15',
    createdAt: '2025-06-01',
    updatedAt: '2025-06-15',
    listingId: 'listing4',
    reserverId: 'user4',
    closeRequested: true,
    listing: {
      id: 'listing4',
      title: 'GoPro HERO10',
      imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
    },
    reserver: {
      id: 'user4',
      firstName: 'Sam',
      lastName: 'White',
      name: 'Sam White'
    }
  },
];

export const MyReservationsContainer: React.FC<MyReservationsContainerProps> = (/*{ userId }*/) => {

// Uncomment and implement the following when GraphQL queries can be imported

//   const { data, loading, error, refetch } = useQuery(MY_RESERVATIONS_QUERY, {
//     variables: { userId },
//     errorPolicy: 'all',
//   });

//   const [cancelReservation, { loading: cancelLoading }] = useMutation(CANCEL_RESERVATION_MUTATION, {
//     onCompleted: () => {
//       refetch();
//     },
//     onError: (error) => {
//       console.error('Failed to cancel reservation:', error);
//     },
//   });

//   const [closeReservation, { loading: closeLoading }] = useMutation(CLOSE_RESERVATION_MUTATION, {
//     onCompleted: () => {
//       refetch();
//     },
//     onError: (error) => {
//       console.error('Failed to close reservation:', error);
//     },
//   });

//   const handleCancel = async (reservationId: string) => {
//     try {
//       await cancelReservation({ variables: { id: reservationId } });
//     } catch (error) {
//       console.error('Error cancelling reservation:', error);
//     }
//   };

//   const handleClose = async (reservationId: string) => {
//     try {
//       await closeReservation({ variables: { id: reservationId } });
//     } catch (error) {
//       console.error('Error closing reservation:', error);
//     }
//   };

//   const handleMessage = (reservationId: string) => {
//     // TODO: Implement messaging functionality
//     console.log('Message for reservation:', reservationId);
//   };

//   const reservations: ReservationRequest[] = data?.myReservations || [];

//   // Filter reservations into active and history
//   const activeReservations = reservations.filter(r => 
//     ['REQUESTED', 'ACCEPTED', 'REJECTED', 'CANCELLED'].includes(r.state)
//   );
  
//   const historyReservations = reservations.filter(r => 
//     r.state === 'RESERVATION_PERIOD'
//   );

  return (
    <MyReservationsMain
      activeReservations={MOCK_ACTIVE_RESERVATIONS}
      historyReservations={MOCK_HISTORY_RESERVATIONS}
      loading={false} // replace with variable. Will not work until queries can be imported
      error={false} // replace with variable. Will not work until queries can be imported
      onCancel={() => {}}
      onClose={() => {}}    // Replace with real functions. Will not work until queries can be imported
      onMessage={() => {}}
      cancelLoading={false}
      closeLoading={false}
    />
  );
};