import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getReservationRequestUnitOfWork } from './reservation-request.uow.ts';

export const ReservationRequestPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	const ReservationRequestModel = models.ReservationRequest.ReservationRequest;
	return {
		ReservationRequestUnitOfWork: getReservationRequestUnitOfWork(
			ReservationRequestModel,
			passport,
		),
	};
};
