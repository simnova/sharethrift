import type React from 'react';
import { Space } from 'antd';
import { ReservationActionButton } from './reservation-action-button.tsx';
import type { ReservationActionStatus } from '../utils/reservation-status.utils.ts';

interface ReservationActionsProps {
	status: ReservationActionStatus;
	onCancel?: () => void;
	onClose?: () => void;
	onMessage?: () => void;
	cancelLoading?: boolean;
	closeLoading?: boolean;
}

export const ReservationActions: React.FC<ReservationActionsProps> = ({
	status,
	onCancel,
	onClose,
	onMessage,
	cancelLoading = false,
	closeLoading = false,
}) => {
	const getActionsForStatus = () => {
		switch (status) {
			case 'REQUESTED':
				return [
					<ReservationActionButton
						key="cancel"
						action="Cancel"
						onClick={onCancel}
						loading={cancelLoading}
					/>,
					<ReservationActionButton
						key="message"
						action="Message"
						onClick={onMessage}
					/>,
				];

			case 'ACCEPTED':
				return [
					<ReservationActionButton
						key="close"
						action="Close"
						onClick={onClose}
						loading={closeLoading}
					/>,
					<ReservationActionButton
						key="message"
						action="Message"
						onClick={onMessage}
					/>,
				];

			case 'REJECTED':
				return [
					<ReservationActionButton
						key="cancel"
						action="Cancel"
						onClick={onCancel}
						loading={cancelLoading}
					/>,
				];

			default:
				// No actions for cancelled or closed reservations
				return [];
		}
	};

	const actions = getActionsForStatus();

	if (actions.length === 0) {
		return null;
	}

	return <Space>{actions}</Space>;
};

