import type React from 'react';
import { Popconfirm } from 'antd';

interface CancelReservationPopconfirmProps {
	/**
	 * Callback when user confirms cancellation
	 */
	onConfirm?: () => void;
	/**
	 * Whether the cancel operation is in progress
	 */
	loading?: boolean;
	/**
	 * The trigger element to wrap with the popconfirm
	 */
	children: React.ReactNode;
}

/**
 * Shared Popconfirm component for cancelling reservation requests.
 * Provides consistent UX and behavior across the application.
 */
export const CancelReservationPopconfirm: React.FC<
	CancelReservationPopconfirmProps
> = ({ onConfirm, loading, children }) => {
	const handleConfirm = () => {
		if (loading) {
			return;
		}
		onConfirm?.();
	};

	return (
		<Popconfirm
			title="Cancel Reservation Request"
			description="Are you sure you want to cancel this request?"
			onConfirm={handleConfirm}
			okText="Yes"
			cancelText="No"
			okButtonProps={{ loading }}
		>
			{children}
		</Popconfirm>
	);
};
