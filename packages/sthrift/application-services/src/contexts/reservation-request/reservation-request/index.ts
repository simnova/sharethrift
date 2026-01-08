import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { create, type ReservationRequestCreateCommand } from './create.ts';
import {
	queryActiveByListingId,
	type ReservationRequestQueryActiveByListingIdCommand,
} from './query-active-by-listing-id.ts';
import {
	queryActiveByReserverId,
	type ReservationRequestQueryActiveByReserverIdCommand,
} from './query-active-by-reserver-id.ts';
import {
	queryActiveByReserverIdAndListingId,
	type ReservationRequestQueryActiveByReserverIdAndListingIdCommand,
} from './query-active-by-reserver-id-and-listing-id.ts';
import {
	queryById,
	type ReservationRequestQueryByIdCommand,
} from './query-by-id.ts';
import {
	queryListingRequestsBySharerId,
	type ReservationRequestQueryListingRequestsBySharerIdCommand,
} from './query-listing-requests-by-sharer-id.ts';
import {
	queryOverlapByListingIdAndReservationPeriod,
	type ReservationRequestQueryOverlapByListingIdAndReservationPeriodCommand,
} from './query-overlap-by-listing-id-and-reservation-period.ts';
import {
	queryPastByReserverId,
	type ReservationRequestQueryPastByReserverIdCommand,
} from './query-past-by-reserver-id.ts';

export interface ReservationRequestApplicationService {
	queryById: (
		command: ReservationRequestQueryByIdCommand,
	) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>;
	queryActiveByReserverId: (
		command: ReservationRequestQueryActiveByReserverIdCommand,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	queryPastByReserverId: (
		command: ReservationRequestQueryPastByReserverIdCommand,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	queryActiveByReserverIdAndListingId: (
		command: ReservationRequestQueryActiveByReserverIdAndListingIdCommand,
	) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>;
	queryOverlapByListingIdAndReservationPeriod: (
		command: ReservationRequestQueryOverlapByListingIdAndReservationPeriodCommand,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	queryActiveByListingId: (
		command: ReservationRequestQueryActiveByListingIdCommand,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	queryListingRequestsBySharerId: (
		command: ReservationRequestQueryListingRequestsBySharerIdCommand,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	create: (
		command: ReservationRequestCreateCommand,
	) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference>;
}

export const ReservationRequest = (
	dataSources: DataSources,
): ReservationRequestApplicationService => {
	return {
		queryById: queryById(dataSources),
		queryActiveByReserverId: queryActiveByReserverId(dataSources),
		queryPastByReserverId: queryPastByReserverId(dataSources),
		queryActiveByReserverIdAndListingId:
			queryActiveByReserverIdAndListingId(dataSources),
		queryOverlapByListingIdAndReservationPeriod:
			queryOverlapByListingIdAndReservationPeriod(dataSources),
		queryActiveByListingId: queryActiveByListingId(dataSources),
		queryListingRequestsBySharerId: queryListingRequestsBySharerId(dataSources),
		create: create(dataSources),
	};
};

export * from './create.ts';
export * from './delete-expired.ts';
export * from './query-active-by-listing-id.ts';
export * from './query-active-by-reserver-id.ts';
export * from './query-active-by-reserver-id-and-listing-id.ts';
export * from './query-by-id.ts';
export * from './query-listing-requests-by-sharer-id.ts';
export * from './query-overlap-by-listing-id-and-reservation-period.ts';
export * from './query-past-by-reserver-id.ts';
