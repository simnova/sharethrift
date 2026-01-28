import type React from 'react';
import { Card, Typography, Image } from 'antd';
import styles from './reservation-card.module.css';
import { ReservationStatusTag } from '@sthrift/ui-components';
import { ReservationActions } from './reservation-actions.tsx';
import type { HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery } from '../../../../../generated.tsx';
import { BASE64_FALLBACK_IMAGE } from '../constants/ui-constants.ts';
import { mapReservationStateToStatus } from '../utils/reservation-status.utils.ts';

type ReservationRequestFieldsFragment =
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery['myActiveReservations'][number];

const { Text } = Typography;

interface ReservationCardProps {
	reservation: ReservationRequestFieldsFragment;
	onCancel?: (id: string) => void;
	onClose?: (id: string) => void;
	onMessage?: (id: string) => void;
	cancelLoading?: boolean;
	closeLoading?: boolean;
	showActions?: boolean;
}

const getSharerDisplay = (
	reservation: ReservationRequestFieldsFragment,
): string => {
	const username = reservation.reserver?.account?.username;
	return username ? `@${username}` : 'Unknown';
};

const hasListingImages = (
	reservation: ReservationRequestFieldsFragment,
): boolean => {
	return Boolean(
		reservation.listing?.images && reservation.listing.images.length > 0,
	);
};

const formatReservationPeriod = (start: string, end: string): string => {
	return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`;
};

const ReservationImage: React.FC<{
	reservation: ReservationRequestFieldsFragment;
}> = ({ reservation }) => {
	if (hasListingImages(reservation)) {
		return (
			<Image
				src={reservation.listing?.images?.[0]}
				alt={reservation.listing?.title ?? 'Listing image'}
				className={styles['listingImage']}
				fallback={BASE64_FALLBACK_IMAGE}
			/>
		);
	}
	return (
		<div className={styles['noImagePlaceholder']}>
			<span className={styles['noImageText']}>No Image</span>
		</div>
	);
};

interface MetaFieldProps {
	label: string;
	value: string;
}

const MetaField: React.FC<MetaFieldProps> = ({ label, value }) => (
	<div>
		<Text strong className={styles['cardMetaLabel']}>
			{label}:{' '}
		</Text>
		<Text className={styles['cardMetaValue']}>{value}</Text>
	</div>
);

export const ReservationCard: React.FC<ReservationCardProps> = ({
	reservation,
	onCancel,
	onClose,
	onMessage,
	cancelLoading = false,
	closeLoading = false,
	showActions = true,
}) => {
	const status = mapReservationStateToStatus(reservation.state);

	return (
		<Card className="mb-4" styles={{ body: { padding: 0 } }}>
			{/* biome-ignore lint/complexity/useLiteralKeys: generated CSS module typing uses index signature */}
			<div className={styles['cardRow']}>
				<div className={styles['reservationImageWrapper']}>
					<ReservationImage reservation={reservation} />
					<div className={styles['statusTagOverlay']}>
						<ReservationStatusTag status={status} />
					</div>
				</div>
				<div className={styles['cardContent']}>
					<div className={styles['cardTitle']}>
						{reservation.listing?.title ?? 'Unknown Listing'}
					</div>
					<div className={styles['cardMeta']}>
						<MetaField label="Sharer" value={getSharerDisplay(reservation)} />
						<MetaField
							label="Requested On"
							value={new Date(reservation.createdAt).toLocaleDateString()}
						/>
						<MetaField
							label="Reservation Period"
							value={formatReservationPeriod(
								reservation.reservationPeriodStart,
								reservation.reservationPeriodEnd,
							)}
						/>
					</div>
					{showActions && (
						<div className={styles['cardActions']}>
							<ReservationActions
								status={status}
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
