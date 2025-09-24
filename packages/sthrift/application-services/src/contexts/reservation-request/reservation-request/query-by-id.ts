import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestQueryByIdCommand {
    id: string;
    fields?: string[];
}

export const queryById = (
    dataSources: DataSources,
) => {
    return async (
        command: ReservationRequestQueryByIdCommand,
    ): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> => {
        return await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getById(
            command.id, 
            { fields: command.fields }
        )
    }
}