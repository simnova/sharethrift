import type { ReservationRequestRepository } from './reservation-request.repository.ts';
import type { ReservationRequestProps } from './reservation-request.aggregate.ts';

export interface ReservationRequestUnitOfWork<props extends ReservationRequestProps> {
	reservationRequestRepository: ReservationRequestRepository<props>;
	withTransaction<T>(
		func: (uow: ReservationRequestUnitOfWork<props>) => Promise<T>,
	): Promise<T>;
}
