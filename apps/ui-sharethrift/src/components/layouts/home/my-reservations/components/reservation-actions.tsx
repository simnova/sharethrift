import type React from 'react';
import { Space } from 'antd';
import { ReservationActionButton } from './reservation-action-button.tsx';

export interface ReservationActionsProps {
	status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CLOSED' | 'CANCELLED';
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
		const actions = [];

		switch (status) {
			case 'REQUESTED':
				actions.push(
					<ReservationActionButton
						key="cancel"
						action="Cancel"
						onClick={onCancel}
						loading={cancelLoading}
					/>,
				);
				actions.push(
					<ReservationActionButton
						key="message"
						action="Message"
						onClick={onMessage}
					/>,
				);
				break;

			case 'ACCEPTED':
				actions.push(
					<ReservationActionButton
						key="close"
						action="Close"
						onClick={onClose}
						loading={closeLoading}
					/>,
				);
				actions.push(
					<ReservationActionButton
						key="message"
						action="Message"
						onClick={onMessage}
					/>,
				);
				break;

			case 'REJECTED':
				actions.push(
					<ReservationActionButton
						key="cancel"
						action="Cancel"
						onClick={onCancel}
						loading={cancelLoading}
					/>,
				);
				break;

			default:
				// No actions for cancelled or closed reservations
				break;
		}

		return actions;
	};

	const actions = getActionsForStatus();

	if (actions.length === 0) {
		return null;
	}

	return <Space>{actions}</Space>;
};

