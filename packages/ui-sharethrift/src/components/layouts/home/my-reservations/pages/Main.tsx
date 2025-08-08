import React from 'react';
import { Tabs, Table, Card, Button, Tag, Image, Space, Typography, Alert, Spin } from 'antd';
import { MessageOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ReservationRequest } from './main.container';

const { Title, Text } = Typography;

export interface MyReservationsMainProps {
  activeReservations: ReservationRequest[];
  historyReservations: ReservationRequest[];
  loading: boolean;
  error?: any;
  onCancel: (reservationId: string) => void;
  onClose: (reservationId: string) => void;
  onMessage: (reservationId: string) => void;
  cancelLoading: boolean;
  closeLoading: boolean;
}

const getStatusColor = (state: ReservationRequest['state']) => {
  switch (state) {
    case 'REQUESTED':
      return 'blue';
    case 'ACCEPTED':
      return 'green';
    case 'REJECTED':
      return 'red';
    case 'CANCELLED':
      return 'orange';
    case 'RESERVATION_PERIOD':
      return 'purple';
    default:
      return 'default';
  }
};

const getStatusText = (state: ReservationRequest['state']) => {
  switch (state) {
    case 'REQUESTED':
      return 'Pending';
    case 'ACCEPTED':
      return 'Accepted';
    case 'REJECTED':
      return 'Rejected';
    case 'CANCELLED':
      return 'Cancelled';
    case 'RESERVATION_PERIOD':
      return 'Closed';
    default:
      return state;
  }
};

const renderActions = (
  record: ReservationRequest,
  onCancel: (id: string) => void,
  onClose: (id: string) => void,
  onMessage: (id: string) => void,
  cancelLoading: boolean,
  closeLoading: boolean
) => {
  const actions = [];

  switch (record.state) {
    case 'REQUESTED':
      actions.push(
        <Button
          key="cancel"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => onCancel(record.id)}
          loading={cancelLoading}
        >
          Cancel
        </Button>
      );
      actions.push(
        <Button
          key="message"
          size="small"
          icon={<MessageOutlined />}
          onClick={() => onMessage(record.id)}
        >
          Message
        </Button>
      );
      break;

    case 'ACCEPTED':
      actions.push(
        <Button
          key="close"
          size="small"
          icon={<CloseOutlined />}
          onClick={() => onClose(record.id)}
          loading={closeLoading}
        >
          Close
        </Button>
      );
      actions.push(
        <Button
          key="message"
          size="small"
          icon={<MessageOutlined />}
          onClick={() => onMessage(record.id)}
        >
          Message
        </Button>
      );
      break;

    case 'REJECTED':
      actions.push(
        <Button
          key="cancel"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => onCancel(record.id)}
          loading={cancelLoading}
        >
          Cancel
        </Button>
      );
      break;

    default:
      // No actions for cancelled or closed reservations
      break;
  }

  return <Space>{actions}</Space>;
};

const ReservationCard: React.FC<{
  reservation: ReservationRequest;
  onCancel: (id: string) => void;
  onClose: (id: string) => void;
  onMessage: (id: string) => void;
  cancelLoading: boolean;
  closeLoading: boolean;
}> = ({ reservation, onCancel, onClose, onMessage, cancelLoading, closeLoading }) => (
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
    actions={[
      renderActions(reservation, onCancel, onClose, onMessage, cancelLoading, closeLoading)
    ]}
  >
    <Card.Meta
      title={reservation.listing?.title || 'Unknown Listing'}
      description={
        <div className="space-y-2">
          <div>
            <Text strong>Sharer: </Text>
            <Text>{reservation.listing?.title || 'Unknown'}</Text>
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
            <Tag color={getStatusColor(reservation.state)}>
              {getStatusText(reservation.state)}
            </Tag>
          </div>
        </div>
      }
    />
  </Card>
);

export default function MyReservationsMain({
  activeReservations,
  historyReservations,
  loading,
  error,
  onCancel,
  onClose,
  onMessage,
  cancelLoading,
  closeLoading,
}: MyReservationsMainProps) {
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

  const columns = [
    {
      title: 'Listing',
      dataIndex: 'listing',
      key: 'listing',
      render: (listing: ReservationRequest['listing']) => (
        <div className="flex items-center space-x-3">
          {listing?.imageUrl && (
            <Image
              width={50}
              height={50}
              src={listing.imageUrl}
              alt={listing.title}
              style={{ objectFit: 'cover', borderRadius: '4px' }}
            />
          )}
          <Text strong>{listing?.title || 'Unknown Listing'}</Text>
        </div>
      ),
    },
    {
      title: 'Sharer',
      dataIndex: 'reserver',
      key: 'sharer',
      render: (reserver: ReservationRequest['reserver']) => (
        <Text>{reserver?.name || 'Unknown'}</Text>
      ),
    },
    {
      title: 'Requested On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <Text>{new Date(createdAt).toLocaleDateString()}</Text>
      ),
    },
    {
      title: 'Reservation Period',
      key: 'period',
      render: (record: ReservationRequest) => (
        <Text>
          {new Date(record.reservationPeriodStart).toLocaleDateString()} - {' '}
          {new Date(record.reservationPeriodEnd).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'state',
      key: 'status',
      render: (state: ReservationRequest['state']) => (
        <Tag color={getStatusColor(state)}>
          {getStatusText(state)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ReservationRequest) =>
        renderActions(record, onCancel, onClose, onMessage, cancelLoading, closeLoading),
    },
  ];

  const tabItems = [
    {
      key: 'active',
      label: `Active Reservations (${activeReservations.length})`,
      children: (
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table
              columns={columns}
              dataSource={activeReservations}
              rowKey="id"
              pagination={false}
              locale={{
                emptyText: 'No active reservations found'
              }}
            />
          </div>
          
          {/* Mobile Card View */}
          <div className="block md:hidden">
            {activeReservations.length === 0 ? (
              <div className="text-center py-8">
                <Text type="secondary">No active reservations found</Text>
              </div>
            ) : (
              activeReservations.map(reservation => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onCancel={onCancel}
                  onClose={onClose}
                  onMessage={onMessage}
                  cancelLoading={cancelLoading}
                  closeLoading={closeLoading}
                />
              ))
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'history',
      label: `Reservation History (${historyReservations.length})`,
      children: (
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table
              columns={columns.filter(col => col.key !== 'actions')} // Remove actions column for history
              dataSource={historyReservations}
              rowKey="id"
              pagination={false}
              locale={{
                emptyText: 'No reservation history found'
              }}
            />
          </div>
          
          {/* Mobile Card View */}
          <div className="block md:hidden">
            {historyReservations.length === 0 ? (
              <div className="text-center py-8">
                <Text type="secondary">No reservation history found</Text>
              </div>
            ) : (
              historyReservations.map(reservation => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onCancel={() => {}} // No actions for history
                  onClose={() => {}} // No actions for history
                  onMessage={() => {}} // No actions for history
                  cancelLoading={false}
                  closeLoading={false}
                />
              ))
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>My Reservations</Title>
      <Tabs defaultActiveKey="active" items={tabItems} />
    </div>
  );
}
