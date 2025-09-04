import React from 'react';
import { Image } from 'antd';
import { Dashboard, ReservationStatusTag } from '@sthrift/ui-sharethrift-components';
import { ReservationActions } from './reservation-actions.tsx';
import { ReservationCard } from './reservation-card.tsx';
import styles from './reservations-view.module.css';
import type { ReservationRequest } from '../pages/my-reservations.tsx';

export interface ReservationsViewProps {
  reservations: ReservationRequest[];
  onCancel?: (id: string) => void;
  onClose?: (id: string) => void;
  onMessage?: (id: string) => void;
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
  const columns = [
    {
      title: 'Listing',
      dataIndex: 'listing',
      key: 'listing',
      render: (listing: ReservationRequest['listing']) => (
        <div className={styles.listingCell}>
          {listing?.imageUrl && (
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              className={styles.listingImage}
              preview={false}
            />
          )}
          <span className={styles.tableText}>{listing?.title || 'Unknown Listing'}</span>
        </div>
      ),
    },
    {
      title: 'Sharer',
      dataIndex: 'reserver',
      key: 'sharer',
      render: (reserver: ReservationRequest['reserver']) => (
        <span className={styles.tableText}>
          {reserver?.name ? `@${reserver.name}` : 'Unknown'}
        </span>
      ),
    },
    {
      title: 'Requested On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span className={styles.tableText}>{new Date(createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      title: 'Reservation Period',
      key: 'period',
      render: (record: ReservationRequest) => (
        <span className={styles.tableText}>
          {new Date(record.reservationPeriodStart).toLocaleDateString()} - {' '}
          {new Date(record.reservationPeriodEnd).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'state',
      key: 'status',
      render: (state: ReservationRequest['state']) => (
        <ReservationStatusTag status={state} />
      ),
    },
    ...(showActions ? [{
      title: 'Actions',
      key: 'actions',
      render: (record: ReservationRequest) => (
        <ReservationActions
          status={record.state}
          onCancel={() => onCancel?.(record.id)}
          onClose={() => onClose?.(record.id)}
          onMessage={() => onMessage?.(record.id)}
          cancelLoading={cancelLoading}
          closeLoading={closeLoading}
        />
      ),
    }] : []),
  ];

  const renderGridItem = (record: ReservationRequest) => (
    <ReservationCard
      key={record.id}
      reservation={record}
      onCancel={onCancel}
      onClose={onClose}
      onMessage={onMessage}
      cancelLoading={cancelLoading}
      closeLoading={closeLoading}
      showActions={showActions}
    />
  );

  return (
    <Dashboard
      data={reservations}
      columns={columns}
      renderGridItem={renderGridItem}
      rowKey="id"
      emptyText={emptyText}
    />
  );
};

export default ReservationsView;