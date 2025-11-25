import type React from 'react';
import { Button } from 'antd';

// No-op function to avoid recreating on every render
const NO_OP_HANDLER = () => {
	// No-op: default handler when no onClick is provided
};

export interface ReservationActionButtonProps {
	action: 'Cancel' | 'Close' | 'Message';
	onClick?: () => void;
	loading?: boolean;
}

export const ReservationActionButton: React.FC<
	ReservationActionButtonProps
> = ({ action, onClick, loading = false }) => {
	const handleClick = onClick || NO_OP_HANDLER;

	return (
		<Button onClick={handleClick} loading={loading} size="small" type="link">
			{action}
		</Button>
	);
};
