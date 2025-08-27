import React from 'react';
import { Card, Typography } from 'antd';
import styles from './reservation-card.module.css';
import { ReservationStatusTag } from '@sthrift/ui-sharethrift-components';
import { ReservationActions } from './reservation-actions.tsx';
import type { ReservationRequest } from '../pages/my-reservations.tsx';

const { Text } = Typography;

export interface ReservationCardProps {
  reservation: ReservationRequest;
  onCancel?: (id: string) => void;
  onClose?: (id: string) => void;
  onMessage?: (id: string) => void;
  cancelLoading?: boolean;
  closeLoading?: boolean;
  showActions?: boolean;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
  onClose,
  onMessage,
  cancelLoading = false,
  closeLoading = false,
  showActions = true,
}) => {
  // Compute sharer display name with @ prefix if present
  let sharerDisplay = 'Unknown';
  if (reservation.reserver?.name) {
    sharerDisplay = `@${reservation.reserver.name}`;
  } else if (reservation.reserver?.firstName || reservation.reserver?.lastName) {
    sharerDisplay = `@${[
      reservation.reserver?.firstName || '',
      reservation.reserver?.lastName || ''
    ].join(' ').trim()}`;
  }

  return (
    <Card className="mb-4" bodyStyle={{ padding: 0 }}>
      <div className={styles.cardRow}>
        {reservation.listing?.imageUrl ? (
          <div className={styles.reservationImageWrapper}>
            <img
              alt={reservation.listing.title}
              src={reservation.listing.imageUrl}
              className={styles.reservationImage}
            />
            <div className={styles.statusTagOverlay}>
              <ReservationStatusTag status={reservation.state} />
            </div>
          </div>
        ) : null}
        <div className={styles.cardContent}>
          <div className={styles.cardTitle}>{reservation.listing?.title || 'Unknown Listing'}</div>
          <div className={styles.cardMeta}>
            <div>
              <Text strong className={styles.cardMetaLabel}>Sharer: </Text>
              <Text className={styles.cardMetaValue}>{sharerDisplay}</Text>
            </div>
            <div>
              <Text strong className={styles.cardMetaLabel}>Requested On: </Text>
              <Text className={styles.cardMetaValue}>{new Date(reservation.createdAt).toLocaleDateString()}</Text>
            </div>
            <div>
              <Text strong className={styles.cardMetaLabel}>Reservation Period: </Text>
              <Text className={styles.cardMetaValue}>
                {new Date(reservation.reservationPeriodStart).toLocaleDateString()} - {' '}
                {new Date(reservation.reservationPeriodEnd).toLocaleDateString()}
              </Text>
            </div>
          </div>
          {showActions && (
            <div className={styles.cardActions}>
              <ReservationActions
                status={reservation.state}
                onCancel={() => onCancel?.(reservation.id)}
                onClose={() => onClose?.(reservation.id)}
                onMessage={() => onMessage?.(reservation.id)}
                cancelLoading={cancelLoading}
                closeLoading={closeLoading}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ReservationCard;