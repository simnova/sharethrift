import React from 'react';
import { ReservationsTable } from '../reservations-table/reservations-table.js';
import { ReservationsGrid } from '../reservations-grid/reservations-grid.js';
import styles from './reservations-view.module.css';
import type { ReservationRequest } from '../../types/reservation-request.js';

export interface ReservationsViewProps {
  reservations: ReservationRequest[]; // Will eventually come from generated graphql files
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
      {/* Mobile Grid View */}
      <div className={styles.mobileOnly}>
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

      {/* Desktop Table View */}
      <div className={styles.desktopOnly}>
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
    </div>
  );
};

export default ReservationsView;