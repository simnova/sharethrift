import { ComponentQueryLoader } from '@sthrift/ui-components';
import { Alert } from 'antd';
import { useQuery, useMutation } from '@apollo/client/react';
import {
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
	type HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery,
	HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
	HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
	ViewListingCurrentUserDocument,
	type ViewListingCurrentUserQuery,
} from '../../../../../../generated.tsx';
import { ReservationsView } from './reservations-view.tsx';

const RESERVATION_REQUEST_TYPENAME = 'ReservationRequest';

type ReservationsViewActiveContainerProps = Record<string, never>;

export const ReservationsViewActiveContainer: React.FC<
	ReservationsViewActiveContainerProps
> = () => {
	// Get current user ID
	const {
		data: userData,
		loading: userLoading,
		error: userError,
	} = useQuery<ViewListingCurrentUserQuery>(ViewListingCurrentUserDocument, {
		fetchPolicy: 'cache-first',
	});
	const userId = userData?.currentUser?.id;

	// Get active reservations
	const {
		data: reservationsData,
		loading: reservationsLoading,
		error: reservationsError,
	} = useQuery<HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery>(
		HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
		{
			variables: { userId: userId || '' },
			skip: !userId,
			fetchPolicy: 'cache-first',
		},
	);
	const activeReservations = reservationsData?.myActiveReservations ?? [];

	// Mutation hooks
	const [cancel, { loading: cancelLoading }] = useMutation(
		HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
		{
			update(cache, { data }) {
				const id = data?.cancelReservation?.id;
				if (id) {
					const cacheId = cache.identify({
						__typename: RESERVATION_REQUEST_TYPENAME,
						id,
					});
					if (cacheId) {
						cache.evict({ id: cacheId });
						cache.gc();
					}
				}
			},
		},
	);

	const [close, { loading: closeLoading }] = useMutation(
		HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
		{
			update(cache, { data }) {
				const id = data?.closeReservation?.id;
				if (id) {
					const cacheId = cache.identify({
						__typename: RESERVATION_REQUEST_TYPENAME,
						id,
					});
					if (cacheId) {
						cache.evict({ id: cacheId });
						cache.gc();
					}
				}
			},
		},
	);

	const handleCancel = (id: string) => cancel({ variables: { input: { id } } });
	const handleClose = (id: string) => close({ variables: { input: { id } } });

	const loading = userLoading || reservationsLoading;
	const error = userError || reservationsError;

	const handleMessage = (reservationId: string) => {
		console.log('Message for reservation', reservationId);
	};

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			errorComponent={
				<Alert
					message="Error Loading Reservations"
					description="There was an error loading your reservations. Please try again later."
					type="error"
					showIcon
				/>
			}
			hasData={activeReservations}
			hasDataComponent={
				<ReservationsView
					reservations={activeReservations ?? []}
					onCancel={handleCancel}
					onClose={handleClose}
					onMessage={handleMessage}
					cancelLoading={cancelLoading}
					closeLoading={closeLoading}
					showActions
					emptyText="No active reservations"
				/>
			}
		/>
	);
};

