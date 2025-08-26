import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import { getReservationRequestUnitOfWork } from './reservation-request.uow.ts';

export const ReservationRequestPersistence = (models: ModelsContext, passport: Domain.Passport) => {
	const ReservationRequestModel = models.ReservationRequest.ReservationRequest;
	return {
		ReservationRequestUnitOfWork: getReservationRequestUnitOfWork(ReservationRequestModel, passport),
	};
};