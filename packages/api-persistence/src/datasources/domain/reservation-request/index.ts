import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../models-context.ts';
import * as ReservationRequest from './reservation-request/index.ts';

export const ReservationRequestContextPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	ReservationRequest: ReservationRequest.ReservationRequestPersistence(
		models,
		passport,
	),
});
