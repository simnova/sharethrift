import type React from 'react';
import { Button } from 'antd';

export interface ReservationActionButtonProps {
	action: 'Cancel' | 'Close' | 'Message';
	onClick?: () => void;
	loading?: boolean;
}

export const ReservationActionButton: React.FC<
	ReservationActionButtonProps
> = ({ action, onClick, loading = false }) => {
	const handleClick =
		onClick ||
		(() => {
			// No-op: default handler when no onClick is provided
		});

	return (
		<Button onClick={handleClick} loading={loading} size="small" type="link">
			{action}
		</Button>
	);
};

export default ReservationActionButton;
