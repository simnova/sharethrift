import React from 'react';
import { Card, Typography, Image, Space, Divider } from 'antd';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { ReservationStatusTag } from '../../atoms/reservation-status-tag/index.js';
import { ReservationActions } from '../reservation-actions/index.js';

const { Text, Title } = Typography;

export interface ReservationData {
  id: string;
  listing: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
  };
  reserver: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'closing' | 'closed';
  reservationPeriodStart: string;
  reservationPeriodEnd: string;
  requestedOn: string;
}

export interface ReservationCardProps {
  reservation: ReservationData;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  onClose?: (id: string) => void;
  onMessage?: (id: string) => void;
  loading?: {
    accept?: boolean;
    reject?: boolean;
    cancel?: boolean;
    close?: boolean;
    message?: boolean;
  };
  showActions?: boolean;
  className?: string;
}

/**
 * ReservationCard - Molecule component that displays reservation request information in a card layout
 * Designed for mobile view where table layout is not suitable
 */
export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onAccept,
  onReject,
  onCancel,
  onClose,
  onMessage,
  loading = {},
  showActions = true,
  className,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateRange = (start: string, end: string) => {
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'accept':
        onAccept?.(reservation.id);
        break;
      case 'reject':
        onReject?.(reservation.id);
        break;
      case 'cancel':
        onCancel?.(reservation.id);
        break;
      case 'close':
        onClose?.(reservation.id);
        break;
      case 'message':
        onMessage?.(reservation.id);
        break;
    }
  };

  return (
    <Card size="small" {...(className && { className })}>
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Listing Image */}
        <div style={{ flexShrink: 0 }}>
          <Image
            src={reservation.listing.imageUrl || '/placeholder.png'}
            alt={reservation.listing.title}
            width={80}
            height={80}
            style={{ borderRadius: '6px', objectFit: 'cover' }}
            preview={false}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        </div>

        {/* Reservation Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <Title level={5} style={{ margin: 0, fontSize: '14px' }} ellipsis={{ rows: 1 }}>
              {reservation.listing.title}
            </Title>
            <ReservationStatusTag status={reservation.status} />
          </div>

          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserOutlined style={{ fontSize: '12px', color: '#666' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {reservation.reserver.firstName} {reservation.reserver.lastName}
              </Text>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CalendarOutlined style={{ fontSize: '12px', color: '#666' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {formatDateRange(reservation.reservationPeriodStart, reservation.reservationPeriodEnd)}
              </Text>
            </div>

            <Text type="secondary" style={{ fontSize: '11px' }}>
              Requested on {formatDate(reservation.requestedOn)}
            </Text>
          </Space>

          {showActions && (
            <>
              <Divider style={{ margin: '12px 0 8px 0' }} />
              <ReservationActions
                status={reservation.status}
                onAccept={() => handleAction('accept')}
                onReject={() => handleAction('reject')}
                onCancel={() => handleAction('cancel')}
                onClose={() => handleAction('close')}
                onMessage={() => handleAction('message')}
                loading={loading}
                size="small"
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
};