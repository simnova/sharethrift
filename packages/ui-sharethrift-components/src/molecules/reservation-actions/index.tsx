import React from 'react';
import { Space } from 'antd';
import { ReservationActionButton } from '../../atoms/reservation-action-button/index.js';

export interface ReservationActionsProps {
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'closing' | 'closed';
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  onMessage?: () => void;
  loading?: {
    accept?: boolean;
    reject?: boolean;
    cancel?: boolean;
    close?: boolean;
    message?: boolean;
  };
  disabled?: {
    accept?: boolean;
    reject?: boolean;
    cancel?: boolean;
    close?: boolean;
    message?: boolean;
  };
  className?: string;
  size?: 'small' | 'middle' | 'large';
}

/**
 * ReservationActions - Molecule component that displays appropriate action buttons based on reservation status
 * 
 * Business Rules:
 * - pending: Accept, Reject, Message
 * - accepted: Close, Message
 * - rejected: Cancel, Message
 * - cancelled: (no actions)
 * - closing: Close, Message
 * - closed: (no actions)
 */
export const ReservationActions: React.FC<ReservationActionsProps> = ({
  status,
  onAccept,
  onReject,
  onCancel,
  onClose,
  onMessage,
  loading = {},
  disabled = {},
  className,
  size = 'small',
}) => {
  const getAvailableActions = () => {
    switch (status) {
      case 'pending':
        return [
          { action: 'accept' as const, onClick: onAccept },
          { action: 'reject' as const, onClick: onReject },
          { action: 'message' as const, onClick: onMessage },
        ];
      case 'accepted':
        return [
          { action: 'close' as const, onClick: onClose },
          { action: 'message' as const, onClick: onMessage },
        ];
      case 'rejected':
        return [
          { action: 'cancel' as const, onClick: onCancel },
          { action: 'message' as const, onClick: onMessage },
        ];
      case 'closing':
        return [
          { action: 'close' as const, onClick: onClose },
          { action: 'message' as const, onClick: onMessage },
        ];
      case 'cancelled':
      case 'closed':
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions();

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <Space size="small" {...(className && { className })}>
      {availableActions.map(({ action, onClick }) => (
        onClick && (
          <ReservationActionButton
            key={action}
            action={action}
            onClick={onClick}
            loading={loading[action] || false}
            disabled={disabled[action] || false}
            size={size}
          />
        )
      ))}
    </Space>
  );
};