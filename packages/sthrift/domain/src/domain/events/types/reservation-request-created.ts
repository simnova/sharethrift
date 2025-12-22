import { DomainSeedwork } from '@cellix/domain-seedwork';

interface ReservationRequestCreatedProps {
	reservationRequestId: string;
	listingId: string;
	reserverId: string;
	sharerId: string;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
}

export class ReservationRequestCreated extends DomainSeedwork.CustomDomainEventImpl<ReservationRequestCreatedProps> {
}
