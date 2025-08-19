import type { ReservationRequestPassport } from '../../contexts/reservation-requests/reservation-request.aggregate.js';
import { ReservationRequestVisa } from './reservation-request.visa.js';

/**
 * Main passport implementation for ReservationRequest aggregate.
 * Provides visa-based authorization for reservation request operations.
 */
export class ReservationRequestPassportImpl extends ReservationRequestVisa implements ReservationRequestPassport {
	// The visa functionality is inherited from ReservationRequestVisa
	// This class serves as the main passport interface implementation
}