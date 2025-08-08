import type { ReservationRequestRepository } from './reservation-request.repository.ts';

export interface ReservationRequestUnitOfWork<PassportType> {
	reservationRequestRepository: ReservationRequestRepository<PassportType>;
	withTransaction<T>(
		func: (uow: ReservationRequestUnitOfWork<PassportType>) => Promise<T>,
	): Promise<T>;
}
