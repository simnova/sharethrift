import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { MY_RESERVATIONS_QUERY, CANCEL_RESERVATION_MUTATION, CLOSE_RESERVATION_MUTATION } from './main.container.graphql';
import MyReservationsMain from './Main';

export interface MyReservationsContainerProps {
  userId: string;
}

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
  listing?: {
    id: string;
    title?: string;
    imageUrl?: string;
  };
  reserver?: {
    id: string;
    name?: string;
  };
}

export const MyReservationsContainer: React.FC<MyReservationsContainerProps> = ({ userId }) => {
  const { data, loading, error, refetch } = useQuery(MY_RESERVATIONS_QUERY, {
    variables: { userId },
    errorPolicy: 'all',
  });

  const [cancelReservation, { loading: cancelLoading }] = useMutation(CANCEL_RESERVATION_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Failed to cancel reservation:', error);
    },
  });

  const [closeReservation, { loading: closeLoading }] = useMutation(CLOSE_RESERVATION_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Failed to close reservation:', error);
    },
  });

  const handleCancel = async (reservationId: string) => {
    try {
      await cancelReservation({ variables: { id: reservationId } });
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const handleClose = async (reservationId: string) => {
    try {
      await closeReservation({ variables: { id: reservationId } });
    } catch (error) {
      console.error('Error closing reservation:', error);
    }
  };

  const handleMessage = (reservationId: string) => {
    // TODO: Implement messaging functionality
    console.log('Message for reservation:', reservationId);
  };

  const reservations: ReservationRequest[] = data?.myReservations || [];

  // Filter reservations into active and history
  const activeReservations = reservations.filter(r => 
    ['REQUESTED', 'ACCEPTED', 'REJECTED', 'CANCELLED'].includes(r.state)
  );
  
  const historyReservations = reservations.filter(r => 
    r.state === 'RESERVATION_PERIOD'
  );

  return (
    <MyReservationsMain
      activeReservations={activeReservations}
      historyReservations={historyReservations}
      loading={loading}
      error={error}
      onCancel={handleCancel}
      onClose={handleClose}
      onMessage={handleMessage}
      cancelLoading={cancelLoading}
      closeLoading={closeLoading}
    />
  );
};