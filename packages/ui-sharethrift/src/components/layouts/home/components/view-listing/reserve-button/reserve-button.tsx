import { Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export type ReserveButtonState = 'reserve' | 'cancel' | 'loading' | 'disabled';

export interface ReserveButtonProps {
  state: ReserveButtonState;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function ReserveButton({ state, onClick, disabled = false, className = '' }: ReserveButtonProps) {
  const getButtonText = () => {
    switch (state) {
      case 'cancel':
        return 'Cancel';
      case 'loading':
        return 'Processing...';
      case 'disabled':
        return 'Not Available';
      case 'reserve':
      default:
        return 'Reserve';
    }
  };

  const getButtonType = () => {
    switch (state) {
      case 'cancel':
        return 'default' as const;
      case 'disabled':
        return 'default' as const;
      case 'loading':
      case 'reserve':
      default:
        return 'primary' as const;
    }
  };

  const getButtonStyle = () => {
    switch (state) {
      case 'cancel':
        return {
          width: '100%',
          backgroundColor: '#52c41a', // Green background for cancel state
          borderColor: '#52c41a',
          color: 'white'
        };
      case 'disabled':
        return {
          width: '100%',
          backgroundColor: '#f5f5f5',
          borderColor: '#d9d9d9',
          color: '#00000040'
        };
      default:
        return { width: '100%' };
    }
  };

  const isDisabled = disabled || state === 'disabled' || state === 'loading';

  return (
    <Button
      type={getButtonType()}
      className={`${className} ${state === 'cancel' ? 'cancelButton' : 'primaryButton'}`}
      style={getButtonStyle()}
      onClick={onClick}
      disabled={isDisabled}
      icon={state === 'loading' ? <LoadingOutlined /> : undefined}
    >
      {getButtonText()}
    </Button>
  );
}