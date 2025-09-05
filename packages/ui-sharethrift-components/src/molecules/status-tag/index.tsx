import React from 'react';
import { Tag } from 'antd';

export type ListingStatus = 
  | 'Active' 
  | 'Paused' 
  | 'Reserved' 
  | 'Expired' 
  | 'Draft' 
  | 'Blocked';

export type RequestStatus = 
  | 'Accepted' 
  | 'Rejected' 
  | 'Closed' 
  | 'Pending' 
  | 'Closing';

export interface StatusTagProps {
  status: ListingStatus | RequestStatus;
  className?: string;
}

const getStatusColor = (status: ListingStatus | RequestStatus): string => {
  switch (status) {
    case 'Active':
      return 'green';
    case 'Paused':
      return 'yellow';
    case 'Reserved':
      return 'blue';
    case 'Draft':
    case 'Closed':
      return 'default';
    case 'Blocked':
      return 'purple';
    case 'Expired':
      return 'red';
    case 'Accepted':
      return 'green';
    case 'Rejected':
      return 'red';
    case 'Pending':
      return 'orange';
    case 'Closing':
      return 'blue';
    default:
      return 'default';
  }
};

export const StatusTag: React.FC<StatusTagProps> = ({ status, className }) => {
  const color = getStatusColor(status);
  
  const tagProps = {
    color,
    ...(className && { className })
  };
  
  return (
    <Tag {...tagProps}>
      {status}
    </Tag>
  );
};

export default StatusTag;