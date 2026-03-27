export interface ReservationRequestNotes {
	lastReservationRequestId: string;
	lastReservationRequestState: string;
	lastReservationRequestStartDate: string;
	lastReservationRequestEndDate: string;
	lastValidationError: string;
	reservationRequestCountForListing: number;
}

export interface CreateReservationRequestInput {
	listingId: string;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	reserver: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
	};
}

export interface ReservationRequestResponse {
	id: string;
	listingId: string;
	reserver: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
	};
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	state: string;
	createdAt: Date;
	updatedAt: Date;
}
