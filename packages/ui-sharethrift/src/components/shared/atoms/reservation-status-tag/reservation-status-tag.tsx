import React from 'react';
import { Tag } from 'antd';

export interface ReservationStatusTagProps {
  status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'RESERVATION_PERIOD' | 'CANCELLED';
}

const getStatusColor = (status: ReservationStatusTagProps['status']) => {
  switch (status) {
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

const getStatusText = (status: ReservationStatusTagProps['status']) => {
  switch (status) {
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
      return status;
  }
};

export const ReservationStatusTag: React.FC<ReservationStatusTagProps> = ({ status }) => (
  <Tag color={getStatusColor(status)}>
    {getStatusText(status)}
  </Tag>
);

export default ReservationStatusTag;