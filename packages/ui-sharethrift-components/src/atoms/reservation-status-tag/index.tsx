import React from 'react';
import { Tag, type TagProps } from 'antd';

export interface ReservationStatusTagProps {
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'closing' | 'closed';
  className?: string;
}

const statusConfig: Record<ReservationStatusTagProps['status'], { color: NonNullable<TagProps['color']>; text: string }> = {
  pending: { color: 'processing', text: 'Pending' },
  accepted: { color: 'success', text: 'Accepted' },
  rejected: { color: 'error', text: 'Rejected' },
  cancelled: { color: 'default', text: 'Cancelled' },
  closing: { color: 'warning', text: 'Closing' },
  closed: { color: 'default', text: 'Closed' },
};

/**
 * ReservationStatusTag - Displays the status of a reservation request with appropriate color coding
 * 
 * @param status - The current status of the reservation request
 * @param className - Optional additional CSS class name
 */
export const ReservationStatusTag: React.FC<ReservationStatusTagProps> = ({ 
  status, 
  className 
}) => {
  const config = statusConfig[status];
  
  return (
    <Tag 
      color={config.color}
      {...(className && { className })}
    >
      {config.text}
    </Tag>
  );
};