import { useMutation } from '@apollo/client';
import {
    HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
    HomeMyReservationsReservationsViewActiveContainerCloseReservationDocument,
} from '../../../../../generated.tsx';

export function useReservationMutations() {
    const [cancel, { loading: cancelLoading }] = useMutation(
        HomeMyReservationsReservationsViewActiveContainerCancelReservationDocument,
        {
            update(cache, { data }) {
                const id = data?.cancelReservation?.id;
                if (id) {
                    const cacheId = cache.identify({ __typename: 'ReservationRequest', id });
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
                    const cacheId = cache.identify({ __typename: 'ReservationRequest', id });
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

    return { handleCancel, cancelLoading, handleClose, closeLoading };
}


