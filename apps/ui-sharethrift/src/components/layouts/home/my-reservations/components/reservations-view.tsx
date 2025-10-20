import type React from 'react';
import { ReservationsTable } from './reservations-table.tsx';
import { Alert, Spin } from 'antd';
import styles from './reservations-view.module.css';
import type { ReservationRequestFieldsFragment } from '../../../../../generated.tsx';
import { ReservationsGrid } from './reservations-grid.tsx';

type ReservationsViewStyles = {
	mobileOnly: string;
	desktopOnly: string;
} & Record<string, string>;

export interface ReservationsViewProps {
	reservations: ReservationRequestFieldsFragment[];
	onCancel?: (id: string) => void;
	onClose?: (id: string) => void;
	onMessage?: (id: string) => void;
	cancelLoading?: boolean;
	closeLoading?: boolean;
	showActions?: boolean;
	emptyText?: string;
	loading?: boolean;
	error?: Error | null;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
	reservations,
	onCancel,
	onClose,
	onMessage,
	cancelLoading = false,
	closeLoading = false,
	showActions = true,
	emptyText = 'No reservations found',
	loading = false,
	error,
}) => {
	const classes = styles as ReservationsViewStyles;
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Spin size="large" />
			</div>
		);
	}

	if (error) {
		return (
			<Alert
				message="Error Loading Reservations"
				description="There was an error loading your reservations. Please try again later."
				type="error"
				showIcon
			/>
		);
	}

	return (
		<div>
			{/* Mobile Grid View */}
			<div className={classes.mobileOnly}>
				<ReservationsGrid
					reservations={reservations}
					onCancel={onCancel}
					onClose={onClose}
					onMessage={onMessage}
					cancelLoading={cancelLoading}
					closeLoading={closeLoading}
					showActions={showActions}
					emptyText={emptyText}
				/>
			</div>

			{/* Desktop Table View */}
			<div className={classes.desktopOnly}>
				<ReservationsTable
					reservations={reservations}
					onCancel={onCancel}
					onClose={onClose}
					onMessage={onMessage}
					cancelLoading={cancelLoading}
					closeLoading={closeLoading}
					showActions={showActions}
					emptyText={emptyText}
				/>
			</div>
		</div>
	);
};

export default ReservationsView;
