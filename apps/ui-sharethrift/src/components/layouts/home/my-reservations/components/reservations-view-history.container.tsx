import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useQuery } from '@apollo/client/react';
import {
	HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
	type HomeMyReservationsReservationsViewHistoryContainerPastReservationsQuery,
	ViewListingCurrentUserDocument,
	type ViewListingCurrentUserQuery,
} from '../../../../../generated.tsx';
import { ReservationsView } from './reservations-view.tsx';

export type ReservationsViewHistoryContainerProps = Record<string, never>;

export const ReservationsViewHistoryContainer: React.FC<
	ReservationsViewHistoryContainerProps
> = () => {
	// Get current user ID
	const {
		data: userData,
		loading: userLoading,
		error: userError,
	} = useQuery<ViewListingCurrentUserQuery>(ViewListingCurrentUserDocument, {
		fetchPolicy: 'cache-first',
	});
	const userId = userData?.currentPersonalUserAndCreateIfNotExists?.id;

	// Get past reservations
	const {
		data: reservationsData,
		loading: reservationsLoading,
		error: reservationsError,
	} = useQuery<HomeMyReservationsReservationsViewHistoryContainerPastReservationsQuery>(
		HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
		{
			variables: { userId: userId || '' },
			skip: !userId,
			fetchPolicy: 'cache-first',
		},
	);
	const reservations = reservationsData?.myPastReservations ?? [];
	const loading = userLoading || reservationsLoading;
	const error = userError || reservationsError;

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={reservations}
			hasDataComponent={
				<ReservationsView
					reservations={reservations ?? []}
					showActions={false}
					emptyText="No past reservations"
				/>
			}
		/>
	);
};

export default ReservationsViewHistoryContainer;
