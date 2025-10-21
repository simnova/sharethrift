import type React from 'react';
import { Table } from 'antd';
import styles from './reservations-table.module.css';
import { ReservationStatusTag } from '@sthrift/ui-components';
import { ReservationActions } from './reservation-actions.tsx';
import type { HomeMyReservationsReservationsViewReservationRequestFieldsFragment } from '../../../../../generated.tsx';
import { mapReservationState } from '../../../../../utils/reservation-state-mapper.ts';

type ReservationsTableStyles = {
	listingCell: string;
	tableText: string;
} & Record<string, string>;

export interface ReservationsTableProps {
	reservations: HomeMyReservationsReservationsViewReservationRequestFieldsFragment[]; // Type will eventually come from generated graphql files
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
			title: 'Listing',
			dataIndex: 'listing',
			key: 'listing',
			render: (
				listing: HomeMyReservationsReservationsViewReservationRequestFieldsFragment['listing'],
			) => (
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
			render: (
				reserver: HomeMyReservationsReservationsViewReservationRequestFieldsFragment['reserver'],
			) => (
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
			render: (
				record: HomeMyReservationsReservationsViewReservationRequestFieldsFragment,
			) => (
				<span className={classes.tableText}>
					{new Date(record.reservationPeriodStart).toLocaleDateString()} -{' '}
					{new Date(record.reservationPeriodEnd).toLocaleDateString()}
				</span>
			),
		},
		{
			title: 'Status',
			dataIndex: 'state',
			key: 'status',
			render: (
				state: HomeMyReservationsReservationsViewReservationRequestFieldsFragment['state'],
			) => (
				<ReservationStatusTag
					status={state ? mapReservationState(state) : 'REQUESTED'}
				/>
			),
		},
		...(showActions
			? [
					{
						title: 'Actions',
						key: 'actions',
						render: (
							record: HomeMyReservationsReservationsViewReservationRequestFieldsFragment,
						) => (
							<ReservationActions
								status={
									record.state ? mapReservationState(record.state) : 'REQUESTED'
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
