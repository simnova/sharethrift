import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestCancelCommand {
	id: string;
	callerId: string;
}

const CANCELLABLE_STATES = ['Requested', 'Rejected'] as const;

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

				const reserver = await reservationRequest.loadReserver();
				if (reserver.id !== command.callerId) {
					throw new Error(
						'Only the reserver can cancel their reservation request',
					);
				}

				if (
					!CANCELLABLE_STATES.includes(
						reservationRequest.state as (typeof CANCELLABLE_STATES)[number],
					)
				) {
					throw new Error('Cannot cancel reservation in current state');
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
