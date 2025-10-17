import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useCurrentUserId } from '../hooks/useCurrentUserId.ts';
import { useActiveReservations } from '../hooks/useActiveReservations.ts';
import { useReservationMutations } from '../hooks/useReservationMutations.ts';
import { ReservationsView } from './reservations-view.tsx';

export type ReservationsViewActiveContainerProps = Record<string, never>;

export const ReservationsViewActiveContainer: React.FC<
	ReservationsViewActiveContainerProps
> = () => {
	const { userId, loading: userLoading, error: userError } = useCurrentUserId();
	const {
		reservations: activeReservations,
		loading: reservationsLoading,
		error: reservationsError,
	} = useActiveReservations(userId);
	const { handleCancel, cancelLoading, handleClose, closeLoading } =
		useReservationMutations();

	const loading = userLoading || reservationsLoading;
	const error = userError || reservationsError;

	const handleMessage = (reservationId: string) => {
		console.log('Message for reservation', reservationId);
	};

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={activeReservations}
			hasDataComponent={
				<ReservationsView
					reservations={activeReservations}
					onCancel={handleCancel}
					onClose={handleClose}
					onMessage={handleMessage}
					cancelLoading={cancelLoading}
					closeLoading={closeLoading}
					showActions
					emptyText="No active reservations"
				/>
			}
			noDataComponent={
				<ReservationsView
					reservations={[]}
					showActions
					emptyText="No active reservations"
				/>
			}
		/>
	);
};

export default ReservationsViewActiveContainer;
