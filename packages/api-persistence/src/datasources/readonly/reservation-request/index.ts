import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../models-context.ts';
import { ReservationRequestReadRepositoryImpl } from './reservation-request/index.ts';

export const ReservationRequestContext = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	ReservationRequest: ReservationRequestReadRepositoryImpl(models, passport),
});
