import { ComponentQueryLoader } from '@sthrift/ui-components';
import { ReservationsView } from './reservations-view.tsx';
import { useCurrentUserId } from '../hooks/useCurrentUserId.ts';
import { usePastReservations } from '../hooks/usePastReservations.ts';

export type ReservationsViewHistoryContainerProps = Record<string, never>;

export const ReservationsViewHistoryContainer: React.FC<
	ReservationsViewHistoryContainerProps
> = () => {
	const { userId, loading: userLoading, error: userError } = useCurrentUserId();
	const { reservations, loading: reservationsLoading, error: reservationsError } = usePastReservations(userId);
	const loading = userLoading || reservationsLoading;
	const error = userError || reservationsError;

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={reservations}
			hasDataComponent={
				<ReservationsView
					reservations={reservations}
					showActions={false}
					emptyText="No past reservations"
				/>
			}
			noDataComponent={
				<ReservationsView
					reservations={[]}
					showActions={false}
					emptyText="No past reservations"
				/>
			}
		/>
	);
};

export default ReservationsViewHistoryContainer;
