import React from 'react';
import { Tag } from 'antd';

export interface ReservationStatusTagProps {
  status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'RESERVATION_PERIOD' | 'CANCELLED';
}

export const ReservationStatusTag: React.FC<ReservationStatusTagProps> = ({ status }) => {
  const getTagProps = () => {
    switch (status) {
      case 'REQUESTED':
        return {
          color: 'blue',
          children: 'Requested',
        };
      case 'ACCEPTED':
        return {
          color: 'green',
          children: 'Accepted',
        };
      case 'REJECTED':
        return {
          color: 'red',
          children: 'Rejected',
        };
      case 'RESERVATION_PERIOD':
        return {
          color: 'purple',
          children: 'Active',
        };
      case 'CANCELLED':
        return {
          color: 'default',
          children: 'Cancelled',
        };
      default:
        return {
          color: 'default',
          children: status,
        };
    }
  };

  const tagProps = getTagProps();

  return <Tag {...tagProps} />;
};

export default ReservationStatusTag;