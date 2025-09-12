import React from 'react';
import { Image, Tag } from 'antd';
import styles from './reservations-table.module.css';
import { Dashboard } from '@sthrift/ui-sharethrift-components';
import { ReservationActions } from './reservation-actions.tsx';
import { ReservationCard } from './reservation-card.tsx';
import type { ReservationRequest } from '../pages/my-reservations.tsx';

export interface ReservationsTableProps {
  reservations: ReservationRequest[]; // Type will eventually come from generated graphql files
  onCancel?: (id: string) => void;
  onClose?: (id: string) => void;
  onMessage?: (id: string) => void;
  cancelLoading?: boolean;
  closeLoading?: boolean;
  showActions?: boolean;
  emptyText?: string;
}

const getReservationStatusTagClass = (status: ReservationRequest['state']): string => {
  switch (status) {
    case 'REQUESTED':
      return 'pendingTag';
    case 'ACCEPTED':
      return 'requestAcceptedTag';
    case 'REJECTED':
      return 'requestRejectedTag';
    case 'CLOSED':
      return 'expiredTag';
    case 'CANCELLED':
      return 'expiredTag';
    default:
      return '';
  }
};

const formatReservationStatus = (status: ReservationRequest['state']): string => {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
};

export const ReservationsTable: React.FC<ReservationsTableProps> = ({
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
        <Tag className={getReservationStatusTagClass(state)}>
          {formatReservationStatus(state)}
        </Tag>
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

  return (
    <Dashboard
      data={reservations}
      columns={columns}
      rowKey="id"
      emptyText={emptyText}
      renderGridItem={(reservation) => (
        <ReservationCard reservation={reservation} onCancel={onCancel} onClose={onClose} onMessage={onMessage} cancelLoading={cancelLoading} closeLoading={closeLoading} showActions={showActions} />
      )}
    />
  );
};

export default ReservationsTable;