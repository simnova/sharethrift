import type { Domain, DomainDataSource } from '@sthrift/api-domain';
import type { ModelsContext } from '../../index.ts';
import { UserContextPersistence } from './user/index.ts';
import { ListingContextPersistence } from './listing/index.ts';
import { ReservationRequestContextPersistence } from './reservation-request/index.ts'

export const DomainDataSourceImplementation = (
	models: ModelsContext,
	passport: Domain.Passport,
): DomainDataSource => ({
	User: UserContextPersistence(models, passport),
	Listing: ListingContextPersistence(models, passport),
    ReservationRequest: ReservationRequestContextPersistence(models, passport),
});
