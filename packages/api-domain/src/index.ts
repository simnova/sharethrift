export * as Domain from './domain/index.ts';
import type { ReservationRequestDomainAdapter } from './domain/contexts/reservation-requests/index.js';

// biome-ignore lint/suspicious/noEmptyInterface: Domain data source interface will be extended
export interface DomainDataSource {
	reservationRequestDomainAdapter: ReservationRequestDomainAdapter;
}
