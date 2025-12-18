import type React from 'react';
import { Space, Popconfirm } from 'antd';
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
					<Popconfirm
						key="cancel-confirm"
						title="Cancel Reservation Request"
						description="Are you sure you want to cancel this request?"
						onConfirm={onCancel}
						okText="Yes"
						cancelText="No"
					>
						<span>
							<ReservationActionButton
								key="cancel"
								action="Cancel"
								loading={cancelLoading}
							/>
						</span>
					</Popconfirm>,
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
					<Popconfirm
						key="cancel-confirm"
						title="Cancel Reservation Request"
						description="Are you sure you want to cancel this request?"
						onConfirm={onCancel}
						okText="Yes"
						cancelText="No"
					>
						<span>
							<ReservationActionButton
								key="cancel"
								action="Cancel"
								loading={cancelLoading}
							/>
						</span>
					</Popconfirm>,
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
