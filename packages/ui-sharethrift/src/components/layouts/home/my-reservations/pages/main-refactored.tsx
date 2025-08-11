import React from 'react';
import { Tabs, Typography, Alert, Spin } from 'antd';
import { ReservationsView } from '../../../shared/organisms/reservations-view/reservations-view';
import type { MockReservationRequest } from '../../../shared/mocks/reservation-data';

const { Title } = Typography;

export interface MyReservationsMainProps {
  activeReservations: MockReservationRequest[];
  historyReservations: MockReservationRequest[];
  loading: boolean;
  error?: any;
  onCancel: (reservationId: string) => void;
  onClose: (reservationId: string) => void;
  onMessage: (reservationId: string) => void;
  cancelLoading: boolean;
  closeLoading: boolean;
}

export default function MyReservationsMain({
  activeReservations,
  historyReservations,
  loading,
  error,
  onCancel,
  onClose,
  onMessage,
  cancelLoading,
  closeLoading,
}: MyReservationsMainProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Reservations"
        description="There was an error loading your reservations. Please try again later."
        type="error"
        showIcon
      />
    );
  }

  const tabItems = [
    {
      key: 'active',
      label: `Active Reservations (${activeReservations.length})`,
      children: (
        <ReservationsView
          reservations={activeReservations}
          onCancel={onCancel}
          onClose={onClose}
          onMessage={onMessage}
          cancelLoading={cancelLoading}
          closeLoading={closeLoading}
          showActions={true}
          emptyText="No active reservations found"
        />
      ),
    },
    {
      key: 'history',
      label: `Reservation History (${historyReservations.length})`,
      children: (
        <ReservationsView
          reservations={historyReservations}
          onCancel={onCancel}
          onClose={onClose}
          onMessage={onMessage}
          cancelLoading={cancelLoading}
          closeLoading={closeLoading}
          showActions={false}
          emptyText="No reservation history found"
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>My Reservations</Title>
      <Tabs defaultActiveKey="active" items={tabItems} />
    </div>
  );
}