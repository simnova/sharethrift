export interface ReservationRequest {
	id: string;
	state: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CLOSED' | 'CANCELLED';
	reservationPeriodStart: string;
	reservationPeriodEnd: string;
	createdAt: string;
	updatedAt: string;
	listingId: string;
	reserverId: string;
	closeRequested: boolean;
	listing: {
		id: string;
		title: string;
		imageUrl: string;
	};
	reserver: {
		id: string;
		firstName: string;
		lastName: string;
		name?: string;
	};
}
