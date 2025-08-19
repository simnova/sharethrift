import React from 'react';
import { Button, type ButtonProps } from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined, 
  MessageOutlined, 
  StopOutlined, 
  PoweroffOutlined 
} from '@ant-design/icons';

export interface ReservationActionButtonProps {
  action: 'accept' | 'reject' | 'cancel' | 'close' | 'message';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  size?: ButtonProps['size'];
}

const actionConfig: Record<ReservationActionButtonProps['action'], { 
  icon: React.ReactNode; 
  text: string; 
  type: NonNullable<ButtonProps['type']>;
  danger?: boolean;
}> = {
  accept: { icon: <CheckOutlined />, text: 'Accept', type: 'primary' },
  reject: { icon: <CloseOutlined />, text: 'Reject', type: 'default', danger: true },
  cancel: { icon: <StopOutlined />, text: 'Cancel', type: 'default', danger: true },
  close: { icon: <PoweroffOutlined />, text: 'Close', type: 'primary' },
  message: { icon: <MessageOutlined />, text: 'Message', type: 'default' },
};

/**
 * ReservationActionButton - Action button for reservation requests with predefined styles and icons
 * 
 * @param action - The type of action this button represents
 * @param loading - Whether the button is in a loading state
 * @param disabled - Whether the button is disabled
 * @param onClick - Click handler function
 * @param className - Optional additional CSS class name
 * @param size - Size of the button (small, middle, large)
 */
export const ReservationActionButton: React.FC<ReservationActionButtonProps> = ({
  action,
  loading = false,
  disabled = false,
  onClick,
  className,
  size = 'small',
}) => {
  const config = actionConfig[action];

  return (
    <Button
      type={config.type}
      danger={config.danger || false}
      icon={config.icon}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      size={size}
      {...(className && { className })}
    >
      {config.text}
    </Button>
  );
};