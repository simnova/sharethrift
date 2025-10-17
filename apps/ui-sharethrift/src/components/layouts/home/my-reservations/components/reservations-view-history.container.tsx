import { ComponentQueryLoader } from '@sthrift/ui-components';
import { ReservationsView } from './reservations-view.tsx';
import { useCurrentUserId } from '../hooks/useCurrentUserId.ts';
import { usePastReservations } from '../hooks/usePastReservations.ts';

export type ReservationsViewHistoryContainerProps = Record<string, never>;

export const ReservationsViewHistoryContainer: React.FC<
    ReservationsViewHistoryContainerProps
> = () => {
    const { userId, loading: ul, error: ue } = useCurrentUserId();
    const { reservations, loading: rl, error: re } = usePastReservations(userId);
    const loading = ul || rl;
    const error = ue || re;

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
            hasData={reservations.length > 0}
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
