import React, { useState } from 'react';
import MyReservationsMain from './main-refactored';
import { getActiveReservations, getHistoryReservations, type MockReservationRequest } from '../../../shared/mocks/reservation-data';

export interface MyReservationsContainerProps {
  userId?: string;
  useMockData?: boolean;
}

export const MyReservationsContainerWithMocks: React.FC<MyReservationsContainerProps> = ({ 
  userId = 'mock-user',
  useMockData = true 
}) => {
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  // Using mock data for preview
  const activeReservations = useMockData ? getActiveReservations() : [];
  const historyReservations = useMockData ? getHistoryReservations() : [];

  const handleCancel = async (reservationId: string) => {
    setCancelLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Cancelled reservation:', reservationId);
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleClose = async (reservationId: string) => {
    setCloseLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Closed reservation:', reservationId);
    } catch (error) {
      console.error('Error closing reservation:', error);
    } finally {
      setCloseLoading(false);
    }
  };

  const handleMessage = (reservationId: string) => {
    // TODO: Implement messaging functionality
    console.log('Message for reservation:', reservationId);
  };

  return (
    <MyReservationsMain
      activeReservations={activeReservations}
      historyReservations={historyReservations}
      loading={loading}
      error={null}
      onCancel={handleCancel}
      onClose={handleClose}
      onMessage={handleMessage}
      cancelLoading={cancelLoading}
      closeLoading={closeLoading}
    />
  );
};