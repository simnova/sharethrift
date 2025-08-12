import React from 'react';
import { Table, Image, Typography } from 'antd';
import { ReservationStatusTag } from '../../atoms/reservation-status-tag/reservation-status-tag';
import { ReservationActions } from '../../molecules/reservation-actions/reservation-actions';
import type { ReservationRequest } from '../../../layouts/home/my-reservations/pages/main.container'; // Will eventually come from generated graphql files

const { Text } = Typography;

export interface ReservationsTableProps {
  reservations: ReservationRequest[]; // Will eventually come from generated graphql files
  onCancel: (id: string) => void;
  onClose: (id: string) => void;
  onMessage: (id: string) => void;
  cancelLoading?: boolean;
  closeLoading?: boolean;
  showActions?: boolean;
  emptyText?: string;
}

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
        <ReservationStatusTag status={state} />
      ),
    },
    ...(showActions ? [{
      title: 'Actions',
      key: 'actions',
  render: (record: ReservationRequest) => (
        <ReservationActions
          status={record.state}
          onCancel={() => onCancel(record.id)}
          onClose={() => onClose(record.id)}
          onMessage={() => onMessage(record.id)}
          cancelLoading={cancelLoading}
          closeLoading={closeLoading}
        />
      ),
    }] : []),
  ];

  return (
    <Table
      columns={columns}
      dataSource={reservations}
      rowKey="id"
      pagination={false}
      locale={{
        emptyText,
      }}
    />
  );
};

export default ReservationsTable;