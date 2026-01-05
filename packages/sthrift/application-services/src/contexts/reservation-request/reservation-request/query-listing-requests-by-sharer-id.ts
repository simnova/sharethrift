import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestQueryListingRequestsBySharerIdCommand {
    sharerId: string;
    page: number;
    pageSize: number;
    searchText: string;
    statusFilters: string[];
    sorter: { field: string; order: string };
    fields?: string[];
}

export interface ListingRequestPageItem {
    id: string;
    title: string;
    image?: string | null;
    requestedBy: string;
    requestedOn: string;
    reservationPeriod: string;
    status: string;
}

export interface ListingRequestPage {
    items: ListingRequestPageItem[];
    total: number;
    page: number;
    pageSize: number;
}

// Temporary implementation backed by mock data in persistence read repository
export const queryListingRequestsBySharerId = (
    dataSources: DataSources,
) => {
    return async (
        command: ReservationRequestQueryListingRequestsBySharerIdCommand,
    ): Promise<ListingRequestPage> => {
        const requests: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[] =
            await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getListingRequestsBySharerId(
                command.sharerId,
                { fields: command.fields },
            );

        const mapped: ListingRequestPageItem[] = requests.map((r) => {
            const start =
                r.reservationPeriodStart instanceof Date
                    ? r.reservationPeriodStart
                    : undefined;
            const end =
                r.reservationPeriodEnd instanceof Date ? r.reservationPeriodEnd : undefined;
            return {
                id: r.id,
                title:
                    r.listing && typeof r.listing === 'object' && 'title' in r.listing
                        ? ((r.listing as { title?: string }).title ?? 'Unknown')
                        : 'Unknown',
                image: '/assets/item-images/placeholder.png',
                requestedBy:
                    r.reserver?.account?.username != null
                        ? `@${r.reserver.account.username}`
                        : '@unknown',
                requestedOn:
                    r.createdAt instanceof Date
                        ? r.createdAt.toISOString()
                        : new Date().toISOString(),
                reservationPeriod: `${start ? start.toISOString().slice(0, 10) : 'N/A'} - ${end ? end.toISOString().slice(0, 10) : 'N/A'}`,
                status: r.state ?? 'Pending',
            };
        });

        let working = mapped;
        const searchText = command.searchText.trim();
        if (searchText.length > 0) {
            const term = searchText.toLowerCase();
            working = working.filter((m) => m.title.toLowerCase().includes(term));
        }

        if (command.statusFilters.length > 0) {
            working = working.filter((m) => command.statusFilters.includes(m.status));
        }

        const order = command.sorter.order;
        if (command.sorter.field && (order === 'ascend' || order === 'descend')) {
            const field = command.sorter.field as keyof ListingRequestPageItem;
            working = [...working].sort((a, b) => {
                const A = a[field];
                const B = b[field];
                if (A == null) {
                    return order === 'ascend' ? -1 : 1;
                }
                if (B == null) {
                    return order === 'ascend' ? 1 : -1;
                }
                if (A < B) {
                    return order === 'ascend' ? -1 : 1;
                }
                if (A > B) {
                    return order === 'ascend' ? 1 : -1;
                }
                return 0;
            });
        }

        const total = working.length;
        const startIndex = (command.page - 1) * command.pageSize;
        const endIndex = startIndex + command.pageSize;
        return {
            items: working.slice(startIndex, endIndex),
            total,
            page: command.page,
            pageSize: command.pageSize,
        };
    };
};
