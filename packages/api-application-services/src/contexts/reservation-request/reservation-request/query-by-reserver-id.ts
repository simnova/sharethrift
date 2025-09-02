import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ReservationRequestQueryByReserverIdCommand {
    reserverId: string;
    fields?: string[];
};

export const queryByReserverId = (
    dataSources: DataSources,
) => {
    return async (
        command: ReservationRequestQueryByReserverIdCommand,
    ): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]> => {
        return await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getByReserverId(
            command.reserverId,
            { fields: command.fields }
        )
    }
}