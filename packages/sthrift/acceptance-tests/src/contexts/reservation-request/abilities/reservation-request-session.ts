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
