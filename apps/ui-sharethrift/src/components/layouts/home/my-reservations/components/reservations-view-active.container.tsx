import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useMutation, useQuery } from '@apollo/client';
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
	const { data: currentUserData } = useQuery<ViewListingCurrentUserQuery>(
		ViewListingCurrentUserDocument,
	);

	const userId = currentUserData?.currentPersonalUserAndCreateIfNotExists?.id;

	const { data, loading, error } =
		useQuery<HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery>(
			HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
			{
				variables: { userId: userId || '' },
				skip: !userId,
				fetchPolicy: 'cache-first', // Use cache-first with proper filtering to avoid conflicts
			},
		);

	const [cancelReservationMutation, { loading: cancelLoading }] = useMutation(
		HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
		{
			update: (cache, { data }) => {
				if (data?.cancelReservationRequest) {
					// Remove the cancelled reservation from the active reservations cache
					const cacheId = cache.identify({
						__typename: 'ReservationRequest',
						id: data.cancelReservationRequest.id,
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
				if (data?.closeReservationRequest) {
					// Remove the closed reservation from the active reservations cache
					const cacheId = cache.identify({
						__typename: 'ReservationRequest',
						id: data.closeReservationRequest.id,
					});
					if (cacheId) {
						cache.evict({ id: cacheId });
						cache.gc();
					}
				}
			},
		},
	);

	const handleCancel = async (reservationId: string) => {
		try {
			await cancelReservationMutation({
				variables: { input: { id: reservationId } },
			});
		} catch (error_) {
			console.error('Failed to cancel reservation:', error_);
		}
	};

	const handleClose = async (reservationId: string) => {
		try {
			await closeReservationMutation({
				variables: { input: { id: reservationId } },
			});
		} catch (error_) {
			console.error('Failed to close reservation:', error_);
		}
	};

	const handleMessage = (reservationId: string) => {
		console.log('Message for reservation', reservationId);
	};

	// Filter to only include truly active states (safety net for backend bugs)
	const activeReservations =
		data?.myActiveReservations?.filter(
			(r) => r.state === 'Accepted' || r.state === 'Requested',
		) ?? [];

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
