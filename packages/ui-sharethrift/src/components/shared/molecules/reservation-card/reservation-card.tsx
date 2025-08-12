import React from 'react';
import { Card, Image, Typography } from 'antd';
import { ReservationStatusTag } from '../../atoms/reservation-status-tag/reservation-status-tag';
import { ReservationActions } from '../reservation-actions/reservation-actions';

const { Text } = Typography;

export interface ReservationCardProps {
  reservation: {
    id: string;
    state: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'RESERVATION_PERIOD' | 'CANCELLED';
    reservationPeriodStart: string;
    reservationPeriodEnd: string;
    createdAt: string;
    listing?: {
      title?: string;
      imageUrl?: string;
    };
    reserver?: {
      name?: string;
    };
  };
  onCancel: (id: string) => void;
  onClose: (id: string) => void;
  onMessage: (id: string) => void;
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
  const actions = showActions ? [
    <ReservationActions
      key="actions"
      status={reservation.state}
      onCancel={() => onCancel(reservation.id)}
      onClose={() => onClose(reservation.id)}
      onMessage={() => onMessage(reservation.id)}
      cancelLoading={cancelLoading}
      closeLoading={closeLoading}
    />
  ] : [];

  return (
    <Card
      className="mb-4"
      cover={
        reservation.listing?.imageUrl ? (
          <Image
            alt={reservation.listing.title}
            src={reservation.listing.imageUrl}
            height={200}
            style={{ objectFit: 'cover' }}
          />
        ) : null
      }
      actions={actions}
    >
      <Card.Meta
        title={reservation.listing?.title || 'Unknown Listing'}
        description={
          <div className="space-y-2">
            <div>
              <Text strong>Sharer: </Text>
              <Text>{reservation.reserver?.name || 'Unknown'}</Text>
            </div>
            <div>
              <Text strong>Requested On: </Text>
              <Text>{new Date(reservation.createdAt).toLocaleDateString()}</Text>
            </div>
            <div>
              <Text strong>Reservation Period: </Text>
              <Text>
                {new Date(reservation.reservationPeriodStart).toLocaleDateString()} - {' '}
                {new Date(reservation.reservationPeriodEnd).toLocaleDateString()}
              </Text>
            </div>
            <div>
              <Text strong>Status: </Text>
              <ReservationStatusTag status={reservation.state} />
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ReservationCard;