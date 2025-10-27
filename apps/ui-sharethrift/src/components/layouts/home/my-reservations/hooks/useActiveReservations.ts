import { useQuery } from '@apollo/client/react';
import {
	HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
	type HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery,
} from '../../../../../generated.tsx';

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

	return {
		reservations: data?.myActiveReservations ?? [],
		loading,
		error,
	};
}
