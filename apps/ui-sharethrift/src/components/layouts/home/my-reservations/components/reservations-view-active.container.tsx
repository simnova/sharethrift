import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useCurrentUserId } from '../hooks/useCurrentUserId.ts';
import { useActiveReservations } from '../hooks/useActiveReservations.ts';
import { useReservationMutations } from '../hooks/useReservationMutations.ts';
import { ReservationsView } from './reservations-view.tsx';

export type ReservationsViewActiveContainerProps = Record<string, never>;

export const ReservationsViewActiveContainer: React.FC<
	ReservationsViewActiveContainerProps
> = () => {
	const userId = useCurrentUserId();
	const {
		reservations: activeReservations,
		loading,
		error,
	} = useActiveReservations(userId);
	const { handleCancel, cancelLoading, handleClose, closeLoading } =
		useReservationMutations();

	const handleMessage = (reservationId: string) => {
		console.log('Message for reservation', reservationId);
	};

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={activeReservations.length > 0}
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
