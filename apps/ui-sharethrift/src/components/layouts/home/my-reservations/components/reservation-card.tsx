import type React from 'react';
import { Card, Typography, Image } from 'antd';
import styles from './reservation-card.module.css';
import { ReservationStatusTag } from '@sthrift/ui-components';
import { ReservationActions } from './reservation-actions.tsx';
import type { HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery } from '../../../../../generated.tsx';
import { BASE64_FALLBACK_IMAGE } from '../constants/ui-constants.ts';

type ReservationRequestFieldsFragment =
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery['myActiveReservations'][number];

const { Text } = Typography;

// Helper function to map reservation state to status tag
const mapReservationStateToStatus = (state: string | undefined | null) => {
	switch (state) {
		case 'Accepted':
			return 'ACCEPTED';
		case 'Requested':
			return 'REQUESTED';
		case 'Rejected':
			return 'REJECTED';
		case 'Closed':
			return 'CLOSED';
		case 'Cancelled':
			return 'CANCELLED';
		default:
			return 'REQUESTED';
	}
};

export interface ReservationCardProps {
	reservation: ReservationRequestFieldsFragment;
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
					{reservation.listing?.images &&
					reservation.listing.images.length > 0 ? (
						<Image
							src={reservation.listing.images[0]}
							alt={reservation.listing.title || 'Listing image'}
							className={styles['listingImage']}
							fallback={BASE64_FALLBACK_IMAGE}
						/>
					) : (
						<div className={styles['noImagePlaceholder']}>
							<span className={styles['noImageText']}>No Image</span>
						</div>
					)}
				<div className={styles['statusTagOverlay']}>
					<ReservationStatusTag
						status={mapReservationStateToStatus(reservation.state)}
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
							status={mapReservationStateToStatus(reservation.state)}
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
