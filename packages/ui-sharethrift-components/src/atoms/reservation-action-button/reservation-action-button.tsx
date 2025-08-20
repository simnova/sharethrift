import React from 'react';
import { Button } from 'antd';
import styles from '../../molecules/header/index.module.css';


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
          children: 'Cancel',
          type: 'link' as const,
          className: styles["authButton"] ?? '',
        };
      case 'close':
        return {
          children: 'Close',
          type: 'link' as const,
          className: styles["authButton"] ?? '',
        };
      case 'message':
        return {
          children: 'Message',
          type: 'link' as const,
          className: styles["authButton"] ?? '',
        };
      default:
        return {
          children: 'Action',
          type: 'link' as const,
          className: styles["authButton"] ?? '',
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