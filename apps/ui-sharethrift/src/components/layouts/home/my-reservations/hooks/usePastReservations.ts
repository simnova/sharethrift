import { useQuery } from '@apollo/client/react';
import {
	HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
	type HomeMyReservationsReservationsViewHistoryContainerPastReservationsQuery,
} from '../../../../../generated.tsx';

export function usePastReservations(userId?: string) {
	const { data, loading, error } =
		useQuery<HomeMyReservationsReservationsViewHistoryContainerPastReservationsQuery>(
			HomeMyReservationsReservationsViewHistoryContainerPastReservationsDocument,
			{
				variables: { userId: userId || '' },
				skip: !userId,
				fetchPolicy: 'cache-first',
			},
		);
	return { reservations: data?.myPastReservations ?? [], loading, error };
}
