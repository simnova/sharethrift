import type React from 'react';
import { Card, Typography } from 'antd';
import styles from './reservation-card.module.css';
import { ReservationStatusTag } from '@sthrift/ui-components';
import { ReservationActions } from './reservation-actions.tsx';
import type { HomeMyReservationsReservationsViewReservationRequestFieldsFragment } from '../../../../../generated.tsx';
import { mapReservationState } from '../../../../../utils/reservation-state-mapper.ts';

const { Text } = Typography;

export interface ReservationCardProps {
	reservation: HomeMyReservationsReservationsViewReservationRequestFieldsFragment;
	onCancel?: (id: string) => void;
	onClose?: (id: string) => void;
	onMessage?: (id: string) => void;
	cancelLoading?: boolean;
	closeLoading?: boolean;
	showActions?: boolean;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
	reservation,
	onCancel,
	onClose,
	onMessage,
	cancelLoading = false,
	closeLoading = false,
	showActions = true,
}) => {
	// Compute sharer display name with @ prefix if present
	let sharerDisplay = 'Unknown';
	if (reservation.reserver?.account?.username) {
		sharerDisplay = `@${reservation.reserver.account.username}`;
	}

	return (
		<Card className="mb-4" bodyStyle={{ padding: 0 }}>
			{/* biome-ignore lint/complexity/useLiteralKeys: generated CSS module typing uses index signature */}
			<div className={styles['cardRow']}>
				<div className={styles['reservationImageWrapper']}>
					<div className={styles['statusTagOverlay']}>
						<ReservationStatusTag
							status={
								reservation.state
									? mapReservationState(reservation.state)
									: 'REQUESTED'
							}
						/>
					</div>
				</div>
				<div className={styles['cardContent']}>
					<div className={styles['cardTitle']}>
						{reservation.listing?.title || 'Unknown Listing'}
					</div>
					<div className={styles['cardMeta']}>
						<div>
							<Text strong className={styles['cardMetaLabel']}>
								Sharer:{' '}
							</Text>
							<Text className={styles['cardMetaValue']}>{sharerDisplay}</Text>
						</div>
						<div>
							<Text strong className={styles['cardMetaLabel']}>
								Requested On:{' '}
							</Text>
							<Text className={styles['cardMetaValue']}>
								{new Date(reservation.createdAt).toLocaleDateString()}
							</Text>
						</div>
						<div>
							<Text strong className={styles['cardMetaLabel']}>
								Reservation Period:{' '}
							</Text>
							<Text className={styles['cardMetaValue']}>
								{new Date(
									reservation.reservationPeriodStart,
								).toLocaleDateString()}{' '}
								-{' '}
								{new Date(
									reservation.reservationPeriodEnd,
								).toLocaleDateString()}
							</Text>
						</div>
					</div>
					{showActions && (
						<div className={styles['cardActions']}>
							<ReservationActions
								status={
									reservation.state
										? mapReservationState(reservation.state)
										: 'REQUESTED'
								}
								onCancel={() => onCancel?.(reservation.id)}
								onClose={() => onClose?.(reservation.id)}
								onMessage={() => onMessage?.(reservation.id)}
								cancelLoading={cancelLoading}
								closeLoading={closeLoading}
							/>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
};

export default ReservationCard;
