import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../index.ts';
import type * as PersonalUser from './user/personal-user/index.ts';
import type * as ReservationRequest from './reservation-request/reservation-request/index.ts';
import { UserContext } from './user/index.ts';
import { ReservationRequestContext } from './reservation-request/index.ts'

export interface ReadonlyDataSource {
	User: {
		PersonalUser: {
			PersonalUserReadRepo: PersonalUser.PersonalUserReadRepository;
		};
	};
    ReservationRequest: {
        ReservationRequest: {
            ReservationRequestReadRepo: ReservationRequest.ReservationRequestReadRepository;
        }
    }
}

export const ReadonlyDataSourceImplementation = (
	models: ModelsContext,
	passport: Domain.Passport,
): ReadonlyDataSource => ({
	User: UserContext(models, passport),
    ReservationRequest: ReservationRequestContext(models, passport),
});
