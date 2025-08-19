import React from 'react';
import { Button } from 'antd';
import { MessageOutlined, CloseOutlined, StopOutlined } from '@ant-design/icons';

export interface ReservationActionButtonProps {
  action: 'cancel' | 'close' | 'message';
  onClick: () => void;
  loading?: boolean;
}

export const ReservationActionButton: React.FC<ReservationActionButtonProps> = ({
  action,
  onClick,
  loading = false,
}) => {
  const getButtonProps = () => {
    switch (action) {
      case 'cancel':
        return {
          icon: <StopOutlined />,
          children: 'Cancel',
          type: 'default' as const,
          danger: true,
        };
      case 'close':
        return {
          icon: <CloseOutlined />,
          children: 'Close',
          type: 'primary' as const,
        };
      case 'message':
        return {
          icon: <MessageOutlined />,
          children: 'Message',
          type: 'default' as const,
        };
      default:
        return {
          children: 'Action',
          type: 'default' as const,
        };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <Button
      {...buttonProps}
      onClick={onClick}
      loading={loading}
      size="small"
    />
  );
};

export default ReservationActionButton;