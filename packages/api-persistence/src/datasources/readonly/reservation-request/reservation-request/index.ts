import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import { getReservationRequestReadRepository } from './reservation-request.read-repository.ts';

export type { ReservationRequestReadRepository } from './reservation-request.read-repository.ts';

export const ReservationRequestReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => {
    return {
        ReservationRequestReadRepo: getReservationRequestReadRepository(models, passport),
    };
};
