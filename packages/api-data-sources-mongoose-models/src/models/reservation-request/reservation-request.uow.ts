import {
	type ReservationRequestUnitOfWork,
	type ReservationRequestRepository,
} from '@ocom/api-domain';
import { ReservationRequestRepositoryImpl } from './reservation-request.repository.ts';

export class ReservationRequestUnitOfWorkImpl<PassportType>
	implements ReservationRequestUnitOfWork<PassportType>
{
	public readonly reservationRequestRepository: ReservationRequestRepository<PassportType>;
	private readonly mongoUnitOfWork: any; // Use any for now to avoid generic complexity

	constructor(
		reservationRequestModel: any,
		createPassport: () => PassportType,
		mongoUnitOfWork: any,
	) {
		this.reservationRequestRepository = new ReservationRequestRepositoryImpl(
			reservationRequestModel,
			createPassport,
		);
		this.mongoUnitOfWork = mongoUnitOfWork;
	}

	async withTransaction<T>(
		func: (uow: ReservationRequestUnitOfWork<PassportType>) => Promise<T>,
	): Promise<T> {
		return this.mongoUnitOfWork.withTransaction(async () => {
			return func(this);
		});
	}
}