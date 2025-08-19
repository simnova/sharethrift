import React, { useState } from 'react';
import { Table, Grid, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReservationCard, ReservationStatusTag, ReservationActions } from '@sthrift/ui-sharethrift-components';
import type { MockReservation } from '../mock-data';

const { useBreakpoint } = Grid;

export interface ReservationsViewProps {
  reservations: MockReservation[];
  loading?: boolean;
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  onClose?: (id: string) => void;
  onMessage?: (id: string) => void;
}

/**
 * ReservationsView - Organism component that displays reservations in either table or card format
 * based on screen size (responsive design)
 */
export const ReservationsView: React.FC<ReservationsViewProps> = ({
  reservations,
  loading = false,
  showActions = true,
  onAccept,
  onReject,
  onCancel,
  onClose,
  onMessage,
}) => {
  const screens = useBreakpoint();
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

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

  const handleAction = async (action: string, id: string) => {
    setActionLoading(prev => ({ ...prev, [`${action}-${id}`]: true }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (action) {
        case 'accept':
          onAccept?.(id);
          message.success('Reservation accepted successfully');
          break;
        case 'reject':
          onReject?.(id);
          message.success('Reservation rejected successfully');
          break;
        case 'cancel':
          onCancel?.(id);
          message.success('Reservation cancelled successfully');
          break;
        case 'close':
          onClose?.(id);
          message.success('Reservation closed successfully');
          break;
        case 'message':
          onMessage?.(id);
          message.info('Opening message conversation...');
          break;
      }
    } catch (error) {
      message.error('Action failed. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`${action}-${id}`]: false }));
    }
  };

  // Mobile view - Cards
  if (!screens.md) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={{
              id: reservation.id,
              listing: reservation.listing,
              reserver: reservation.reserver,
              status: reservation.status,
              reservationPeriodStart: reservation.reservationPeriodStart,
              reservationPeriodEnd: reservation.reservationPeriodEnd,
              requestedOn: reservation.requestedOn,
            }}
            onAccept={(id) => handleAction('accept', id)}
            onReject={(id) => handleAction('reject', id)}
            onCancel={(id) => handleAction('cancel', id)}
            onClose={(id) => handleAction('close', id)}
            onMessage={(id) => handleAction('message', id)}
            loading={{
              accept: actionLoading[`accept-${reservation.id}`],
              reject: actionLoading[`reject-${reservation.id}`],
              cancel: actionLoading[`cancel-${reservation.id}`],
              close: actionLoading[`close-${reservation.id}`],
              message: actionLoading[`message-${reservation.id}`],
            }}
            showActions={showActions}
          />
        ))}
      </div>
    );
  }

  // Desktop view - Table
  const columns: ColumnsType<MockReservation> = [
    {
      title: 'Listing',
      dataIndex: 'listing',
      key: 'listing',
      render: (listing) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={listing.imageUrl || '/placeholder.png'}
            alt={listing.title}
            style={{
              width: 60,
              height: 60,
              borderRadius: 6,
              objectFit: 'cover',
            }}
          />
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{listing.title}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{listing.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Sharer',
      dataIndex: 'reserver',
      key: 'reserver',
      render: (reserver) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {reserver.firstName} {reserver.lastName}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>{reserver.email}</div>
        </div>
      ),
    },
    {
      title: 'Requested On',
      dataIndex: 'requestedOn',
      key: 'requestedOn',
      render: (date) => formatDate(date),
    },
    {
      title: 'Reservation Period',
      key: 'period',
      render: (_, record) => formatDateRange(
        record.reservationPeriodStart,
        record.reservationPeriodEnd
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <ReservationStatusTag status={status} />,
    },
  ];

  if (showActions) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <ReservationActions
          status={record.status}
          onAccept={() => handleAction('accept', record.id)}
          onReject={() => handleAction('reject', record.id)}
          onCancel={() => handleAction('cancel', record.id)}
          onClose={() => handleAction('close', record.id)}
          onMessage={() => handleAction('message', record.id)}
          loading={{
            accept: actionLoading[`accept-${record.id}`],
            reject: actionLoading[`reject-${record.id}`],
            cancel: actionLoading[`cancel-${record.id}`],
            close: actionLoading[`close-${record.id}`],
            message: actionLoading[`message-${record.id}`],
          }}
          size="small"
        />
      ),
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={reservations}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} reservations`,
      }}
      scroll={{ x: 800 }}
    />
  );
};