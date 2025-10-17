import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useMutation, useQuery } from '@apollo/client';
import { useCurrentUserId } from '../hooks/useCurrentUserId.ts';
import { useActiveReservations } from '../hooks/useActiveReservations.ts';
import { useReservationMutations } from '../hooks/useReservationMutations.ts';
import {
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
	HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
	HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
	ViewListingCurrentUserDocument,
	type HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery,
	type ViewListingCurrentUserQuery,
} from '../../../../../generated.tsx';
import { ReservationsView } from './reservations-view.tsx';

export type ReservationsViewActiveContainerProps = Record<string, never>;

export const ReservationsViewActiveContainer: React.FC<
    ReservationsViewActiveContainerProps
> = () => {
    const { userId } = useCurrentUserId();
    const { reservations: activeReservations, loading, error } = useActiveReservations(userId);
    const { handleCancel, cancelLoading, handleClose, closeLoading } = useReservationMutations();

	const [cancelReservationMutation, { loading: cancelLoading }] = useMutation(
		HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
		{
			update: (cache, { data }) => {
				if (data?.cancelReservation) {
					// Remove the cancelled reservation from the active reservations cache
					const cacheId = cache.identify({
						__typename: 'ReservationRequest',
						id: data.cancelReservation.id,
					});
					if (cacheId) {
						cache.evict({ id: cacheId });
						cache.gc();
					}
				}
			},
		},
	);

	const [closeReservationMutation, { loading: closeLoading }] = useMutation(
		HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
		{
			update: (cache, { data }) => {
				if (data?.closeReservation) {
					// Remove the closed reservation from the active reservations cache
					const cacheId = cache.identify({
						__typename: 'ReservationRequest',
						id: data.closeReservation.id,
					});
					if (cacheId) {
						cache.evict({ id: cacheId });
						cache.gc();
					}
				}
			},
		},
	);

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
