import React from 'react';
import { Button } from 'antd';
import { MessageOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';

export interface ReservationActionButtonProps {
  action: 'cancel' | 'close' | 'message';
  loading?: boolean;
  onClick: () => void;
  size?: 'small' | 'middle' | 'large';
}

const getButtonConfig = (action: ReservationActionButtonProps['action']) => {
  switch (action) {
    case 'cancel':
      return {
        icon: <DeleteOutlined />,
        text: 'Cancel',
        danger: true,
      };
    case 'close':
      return {
        icon: <CloseOutlined />,
        text: 'Close',
        danger: false,
      };
    case 'message':
      return {
        icon: <MessageOutlined />,
        text: 'Message',
        danger: false,
      };
    default:
      return {
        icon: null,
        text: 'Action',
        danger: false,
      };
  }
};

export const ReservationActionButton: React.FC<ReservationActionButtonProps> = ({
  action,
  loading = false,
  onClick,
  size = 'small',
}) => {
  const config = getButtonConfig(action);

  return (
    <Button
      size={size}
      icon={config.icon}
      onClick={onClick}
      loading={loading}
      danger={config.danger}
    >
      {config.text}
    </Button>
  );
};

export default ReservationActionButton;