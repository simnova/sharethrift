import React from 'react';
import { ReservationsTable } from './reservations-table.tsx';
import { Alert, Spin } from 'antd';
import type { ReservationRequest } from '../pages/my-reservations.tsx';

export interface ReservationsViewProps {
  reservations: ReservationRequest[]; // Will eventually come from generated graphql files
  onCancel?: (id: string) => void;
  onClose?: (id: string) => void;
  onMessage?: (id: string) => void;
  cancelLoading?: boolean;
  closeLoading?: boolean;
  showActions?: boolean;
  emptyText?: string;
  loading?: boolean;
  error?: Error | null;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  reservations,
  onCancel,
  onClose,
  onMessage,
  cancelLoading = false,
  closeLoading = false,
  showActions = true,
  emptyText = 'No reservations found',
  loading = false,
  error,
}) => {
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

  return (
    <ReservationsTable
      reservations={reservations}
      onCancel={onCancel}
      onClose={onClose}
      onMessage={onMessage}
      cancelLoading={cancelLoading}
      closeLoading={closeLoading}
      showActions={showActions}
      emptyText={emptyText}
    />
  );
};

export default ReservationsView;