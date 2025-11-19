import type React from 'react';
import { Table, Image } from 'antd';
import styles from './reservations-table.module.css';
import { ReservationStatusTag } from '@sthrift/ui-components';
import { ReservationActions } from './reservation-actions.tsx';
import type { HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery } from '../../../../../generated.tsx';
import { BASE64_FALLBACK_IMAGE } from '../constants/ui-constants.ts';

type ReservationRequestFieldsFragment =
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery['myActiveReservations'][number];

type ReservationsTableStyles = {
	listingCell: string;
	tableText: string;
} & Record<string, string>;

export interface ReservationsTableProps {
	reservations: ReservationRequestFieldsFragment[];
	onCancel?: (id: string) => void;
	onClose?: (id: string) => void;
	onMessage?: (id: string) => void;
	cancelLoading?: boolean;
	closeLoading?: boolean;
	showActions?: boolean;
	emptyText?: string;
}

export const ReservationsTable: React.FC<ReservationsTableProps> = ({
	reservations,
	onCancel,
	onClose,
	onMessage,
	cancelLoading = false,
	closeLoading = false,
	showActions = true,
	emptyText = 'No reservations found',
}) => {
	const classes = styles as ReservationsTableStyles;
	const columns = [
		{
			title: 'Image',
			dataIndex: 'listing',
			key: 'image',
			width: 80,
			render: (listing: ReservationRequestFieldsFragment['listing']) => (
				<div className={classes.listingCell}>
					{listing?.images && listing.images.length > 0 ? (
						<Image
							src={listing.images[0]}
							alt={listing.title || 'Listing image'}
							width={60}
							height={40}
							style={{ objectFit: 'cover', borderRadius: '4px' }}
							fallback={BASE64_FALLBACK_IMAGE}
						/>
					) : (
						<div
							style={{
								width: 60,
								height: 40,
								backgroundColor: '#f5f5f5',
								borderRadius: '4px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '10px',
								color: '#999',
							}}
						>
							No Image
						</div>
					)}
				</div>
			),
		},
		{
			title: 'Listing',
			dataIndex: 'listing',
			key: 'listing',
			render: (listing: ReservationRequestFieldsFragment['listing']) => (
				<div className={classes.listingCell}>
					<span className={classes.tableText}>
						{listing?.title || 'Unknown Listing'}
					</span>
				</div>
			),
		},
		{
			title: 'Sharer',
			dataIndex: 'reserver',
			key: 'sharer',
			render: (reserver: ReservationRequestFieldsFragment['reserver']) => (
				<span className={classes.tableText}>
					{reserver?.account?.username
						? `@${reserver.account.username}`
						: 'Unknown'}
				</span>
			),
		},
		{
			title: 'Requested On',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (createdAt: string) => (
				<span className={classes.tableText}>
					{new Date(createdAt).toLocaleDateString()}
				</span>
			),
		},
		{
			title: 'Reservation Period',
			key: 'period',
			render: (record: ReservationRequestFieldsFragment) => (
				<span className={classes.tableText}>
					{new Date(Number(record.reservationPeriodStart)).toLocaleDateString()} -{' '}
					{new Date(Number(record.reservationPeriodEnd)).toLocaleDateString()}
				</span>
			),
		},
		{
			title: 'Status',
			dataIndex: 'state',
			key: 'status',
			render: (state: ReservationRequestFieldsFragment['state']) => (
				<ReservationStatusTag
					status={
						state === 'Accepted'
							? 'ACCEPTED'
							: state === 'Requested'
								? 'REQUESTED'
								: state === 'Rejected'
									? 'REJECTED'
									: state === 'Closed'
										? 'CLOSED'
										: state === 'Cancelled'
											? 'CANCELLED'
											: 'REQUESTED'
					}
				/>
			),
		},
		...(showActions
			? [
					{
						title: 'Actions',
						key: 'actions',
						render: (record: ReservationRequestFieldsFragment) => (
							<ReservationActions
								status={
									record.state === 'Accepted'
										? 'ACCEPTED'
										: record.state === 'Requested'
											? 'REQUESTED'
											: record.state === 'Rejected'
												? 'REJECTED'
												: record.state === 'Closed'
													? 'CLOSED'
													: record.state === 'Cancelled'
														? 'CANCELLED'
														: 'REQUESTED'
								}
								onCancel={() => onCancel?.(record.id)}
								onClose={() => onClose?.(record.id)}
								onMessage={() => onMessage?.(record.id)}
								cancelLoading={cancelLoading}
								closeLoading={closeLoading}
							/>
						),
					},
				]
			: []),
	];

	return (
		<Table
			columns={columns}
			dataSource={reservations}
			rowKey="id"
			pagination={false}
			locale={{
				emptyText,
			}}
		/>
	);
};

export default ReservationsTable;
