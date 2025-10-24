import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface ReservationAcceptedProps {
	reservationRequestId: string;
	reserverId: string;
	sharerId: string;
	listingId: string;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
}

export class ReservationAcceptedEvent extends DomainSeedwork.CustomDomainEventImpl<ReservationAcceptedProps> {}
