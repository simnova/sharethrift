import React from 'react';
import { Typography } from 'antd';
import { ReservationCard } from '../../molecules/reservation-card/reservation-card.js';
import type { ReservationRequest } from '../../types/reservation-request.js';

const { Text } = Typography;

export interface ReservationsGridProps {
  reservations: ReservationRequest[]; // Will eventually come from generated graphql files
  onCancel: (id: string) => void;
  onClose: (id: string) => void;
  onMessage: (id: string) => void;
  cancelLoading?: boolean;
  closeLoading?: boolean;
  showActions?: boolean;
  emptyText?: string;
}

export const ReservationsGrid: React.FC<ReservationsGridProps> = ({
  reservations,
  onCancel,
  onClose,
  onMessage,
  cancelLoading = false,
  closeLoading = false,
  showActions = true,
  emptyText = 'No reservations found',
}) => {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-8">
        <Text type="secondary">{emptyText}</Text>
      </div>
    );
  }

  return (
    <div>
      {reservations.map(reservation => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onCancel={onCancel}
          onClose={onClose}
          onMessage={onMessage}
          cancelLoading={cancelLoading}
          closeLoading={closeLoading}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default ReservationsGrid;