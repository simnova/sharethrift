import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useQuery } from '@apollo/client';
import {
	HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
	ViewListingCurrentUserDocument,
	type HomeMyReservationsReservationsViewHistoryContainerPastReservationsQuery,
	type ViewListingCurrentUserQuery,
} from '../../../../../generated.tsx';
import { ReservationsView } from './reservations-view.tsx';

export type ReservationsViewHistoryContainerProps = Record<string, never>;

export const ReservationsViewHistoryContainer: React.FC<
	ReservationsViewHistoryContainerProps
> = () => {
	// Get current user ID
	const { data: currentUserData } = useQuery<ViewListingCurrentUserQuery>(
		ViewListingCurrentUserDocument,
	);

	const userId = currentUserData?.currentPersonalUserAndCreateIfNotExists?.id;

	// Fetch past reservations using GraphQL query
	const { data, loading, error } =
		useQuery<HomeMyReservationsReservationsViewHistoryContainerPastReservationsQuery>(
			HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
			{
				variables: { userId: userId || '' },
				skip: !userId,
				fetchPolicy: 'cache-first', // Use cache-first with proper filtering to avoid conflicts
			},
		);

	return (
		<ComponentQueryLoader
			loading={loading}
			error={error}
			hasData={data?.myPastReservations}
			hasDataComponent={
				<ReservationsView
					reservations={data?.myPastReservations ?? []}
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
