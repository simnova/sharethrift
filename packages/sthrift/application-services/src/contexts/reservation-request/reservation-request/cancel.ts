import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestCancelCommand {
	id: string;
}

export const cancel = (dataSources: DataSources) => {
	return async (
		command: ReservationRequestCancelCommand,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference> => {
		let reservationRequestToReturn:
			| Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference
			| undefined;
		await dataSources.domainDataSource.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork.withScopedTransaction(
			async (repo) => {
				const reservationRequest = await repo.getById(command.id);
				if (!reservationRequest) {
					throw new Error('Reservation request not found');
				}

				reservationRequest.state = 'Cancelled';
				reservationRequestToReturn = await repo.save(reservationRequest);
			},
		);
		if (!reservationRequestToReturn) {
			throw new Error('Reservation request not cancelled');
		}
		return reservationRequestToReturn;
	};
};
