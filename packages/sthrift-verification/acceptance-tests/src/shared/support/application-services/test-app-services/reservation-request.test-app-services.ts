import type { Domain } from '@sthrift/domain';
import {
	createMockReservationRequest,
	getMockActiveByListingId,
	getMockReservationRequestById,
} from '../../test-data/reservation-request.test-data.ts';

interface ReservationRequestCreateCommand {
	listingId: string;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	reserverEmail: string;
}

interface ReservationRequestQueryByIdCommand {
	id: string;
}

interface ReservationRequestQueryActiveByListingIdCommand {
	listingId: string;
}

interface MockReservationRequestContextApplicationService {
	ReservationRequest: {
		create: (command: ReservationRequestCreateCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference>;
		queryById: (command: ReservationRequestQueryByIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>;
		queryActiveByListingId: (command: ReservationRequestQueryActiveByListingIdCommand) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>;
		queryActiveByReserverId: () => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>;
		queryPastByReserverId: () => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>;
		queryActiveByReserverIdAndListingId: () => Promise<null>;
		queryOverlapByListingIdAndReservationPeriod: () => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>;
		queryListingRequestsBySharerId: () => Promise<{ items: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]; total: number; page: number; pageSize: number }>;
	};
}

export function createMockReservationRequestService(): MockReservationRequestContextApplicationService {
	return {
		ReservationRequest: {
			create: (command: ReservationRequestCreateCommand) => {
				const reservation = createMockReservationRequest({
					listingId: command.listingId,
					reserverEmail: command.reserverEmail,
					reservationPeriodStart: command.reservationPeriodStart,
					reservationPeriodEnd: command.reservationPeriodEnd,
				});
				return Promise.resolve(reservation);
			},
			queryById: (command: ReservationRequestQueryByIdCommand) => {
				return Promise.resolve(getMockReservationRequestById(command.id) || null);
			},
			queryActiveByListingId: (command: ReservationRequestQueryActiveByListingIdCommand) => {
				const results = getMockActiveByListingId(command.listingId);
				return Promise.resolve(results);
			},
			queryActiveByReserverId: () => Promise.resolve([]),
			queryPastByReserverId: () => Promise.resolve([]),
			queryActiveByReserverIdAndListingId: () => Promise.resolve(null),
			queryOverlapByListingIdAndReservationPeriod: () => Promise.resolve([]),
			queryListingRequestsBySharerId: () => Promise.resolve({
				items: [],
				total: 0,
				page: 1,
				pageSize: 10,
			}),
		},
	};
}
