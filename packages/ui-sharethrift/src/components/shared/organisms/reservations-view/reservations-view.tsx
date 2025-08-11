import React from 'react';
import { ReservationsTable } from '../reservations-table/reservations-table';
import { ReservationsGrid } from '../reservations-grid/reservations-grid';
import type { MockReservationRequest } from '../../mocks/reservation-data';

export interface ReservationsViewProps {
  reservations: MockReservationRequest[];
  onCancel: (id: string) => void;
  onClose: (id: string) => void;
  onMessage: (id: string) => void;
  cancelLoading?: boolean;
  closeLoading?: boolean;
  showActions?: boolean;
  emptyText?: string;
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
}) => {
  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block">
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
      </div>
      
      {/* Mobile Grid View */}
      <div className="block md:hidden">
        <ReservationsGrid
          reservations={reservations}
          onCancel={onCancel}
          onClose={onClose}
          onMessage={onMessage}
          cancelLoading={cancelLoading}
          closeLoading={closeLoading}
          showActions={showActions}
          emptyText={emptyText}
        />
      </div>
    </div>
  );
};

export default ReservationsView;