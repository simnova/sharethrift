import { useQuery } from '@apollo/client';
import {
    HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument,
    type HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery,
} from '../../../../../generated.tsx';

export function useActiveReservations(userId?: string) {
    const { data, loading, error } = useQuery<
        HomeMyReservationsReservationsViewActiveContainerActiveReservationsQuery
    >(HomeMyReservationsReservationsViewActiveContainerActiveReservationsDocument, {
        variables: { userId: userId || '' },
        skip: !userId,
        fetchPolicy: 'cache-first',
    });

    const reservations =
        data?.myActiveReservations?.filter(
            (r) => r.state === 'Accepted' || r.state === 'Requested',
        ) ?? [];

    return { reservations, loading, error };
}
