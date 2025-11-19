import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface ReservationRequestAcceptedEventProps {
	reservationRequestId: string;
	listingId: string;
	sharerId: string;
	reserverId: string;
	acceptedAt: Date;
}

export class ReservationRequestAcceptedEvent extends DomainSeedwork.CustomDomainEventImpl<ReservationRequestAcceptedEventProps> {}
