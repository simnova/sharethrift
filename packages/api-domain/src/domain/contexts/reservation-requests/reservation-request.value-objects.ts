import { VOString, VOOptional } from '@lucaspaganini/value-objects';

// Reservation request state value object
export class ReservationRequestState extends VOString({
	trim: true,
	minLength: 1,
	maxLength: 50,
	pattern: /^(pending|accepted|rejected|cancelled|closing|closed)$/i,
}) {}

// Reservation listing ID value object for referencing listings in reservation context
export class ReservationListingId extends VOString({
	trim: true,
	minLength: 1,
	maxLength: 50,
}) {}

// Reserver ID value object for referencing users making reservations  
export class ReserverId extends VOString({
	trim: true,
	minLength: 1,
	maxLength: 50,
}) {}

// Optional reason for cancellation or rejection
export class ReservationReason extends VOOptional(
	VOString({
		trim: true,
		minLength: 1,
		maxLength: 500,
	}),
	[null]
) {}