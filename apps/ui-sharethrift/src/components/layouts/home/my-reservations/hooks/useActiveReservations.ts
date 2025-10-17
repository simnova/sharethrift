import { useQuery } from '@apollo/client';
import {
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
	type HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery,
} from '../../../../../generated.tsx';
import { filterActiveReservations } from '../../../../../utils/reservation-state-utils.ts';

export function useActiveReservations(userId?: string) {
	const { data, loading, error } =
		useQuery<HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery>(
			HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
			{
				variables: { userId: userId || '' },
				skip: !userId,
				fetchPolicy: 'cache-first',
			},
		);

	const reservations = filterActiveReservations(
		data?.myActiveReservations ?? [],
	);

	return { reservations, loading, error };
}
