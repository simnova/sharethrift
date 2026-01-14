import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestQueryListingRequestsBySharerIdCommand {
    sharerId: string;
    page?: number;
    pageSize?: number;
    searchText?: string;
    statusFilters?: string[];
    sorter?: { field: string | null; order: 'ascend' | 'descend' | null };
}

// Temporary implementation backed by mock data in persistence read repository
export const queryListingRequestsBySharerId = (
    dataSources: DataSources,
) => {
    return async (
        command: ReservationRequestQueryListingRequestsBySharerIdCommand,
    ): Promise<{
        items: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
        total: number;
        page: number;
        pageSize: number;
    }> => {
        const options: Parameters<typeof dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getListingRequestsBySharerId>[1] = {};
        
        if (command.page !== undefined) options.page = command.page;
        if (command.pageSize !== undefined) options.pageSize = command.pageSize;
        if (command.searchText !== undefined) options.searchText = command.searchText;
        if (command.statusFilters !== undefined) options.statusFilters = command.statusFilters;
        if (command.sorter !== undefined) options.sorter = command.sorter;

        return await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getListingRequestsBySharerId(
            command.sharerId,
            options
        );
    };
};
