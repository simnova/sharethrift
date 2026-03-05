import { GraphqlSession } from '../../../shared/abilities/graphql-session.js';
import type { CreateReservationRequestInput, ReservationRequest } from './reservation-request-session.js';

/**
 * GraphQLReservationRequestSession - Reservation request-specific implementation of GraphQL operations.
 *
 * Extends generic GraphqlSession with reservation request-specific GraphQL queries/mutations.
 * Registers operation handlers in constructor and provides convenience methods.
 */
export class GraphQLReservationRequestSession extends GraphqlSession {
	context = 'reservation';

	constructor(apiUrl: string) {
		super(apiUrl);
		// Register reservation request operations with the parent Session
		this.registerOperation('reservationRequest:create', (input) =>
			this.handleCreateReservationRequest(input as unknown as CreateReservationRequestInput),
		);
		this.registerOperation('reservationRequest:getById', (input) =>
			this.handleGetReservationRequestById(input as unknown as { id: string }),
		);
	}

	/**
	 * Convenience method: Create a reservation request
	 * (delegates to registered operation for backward compatibility)
	 */
	createReservationRequest(input: CreateReservationRequestInput): Promise<ReservationRequest> {
		return this.execute<CreateReservationRequestInput, ReservationRequest>(
			'reservationRequest:create',
			input,
		);
	}

	/**
	 * Convenience method: Get reservation request by ID
	 * (delegates to registered operation for backward compatibility)
	 */
	getReservationRequestById(id: string): Promise<ReservationRequest | null> {
		return this.execute<{ id: string }, ReservationRequest | null>('reservationRequest:getById', { id });
	}

	/**
	 * Handle creating a reservation request via GraphQL
	 */
	private async handleCreateReservationRequest(
		input: CreateReservationRequestInput,
	): Promise<ReservationRequest> {
		// Serialize dates to ISO strings for GraphQL
		const serialized = this.serializeCreateInput(input);

		// TODO: Call GraphQL mutation
		// For now, return a mock response
		return {
			id: `reservation-request-graphql-${Date.now()}`,
			listingId: input.listingId,
			reserver: input.reserver,
			reservationPeriodStart: input.reservationPeriodStart,
			reservationPeriodEnd: input.reservationPeriodEnd,
			state: 'Requested',
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	/**
	 * Handle getting a reservation request by ID via GraphQL
	 */
	private async handleGetReservationRequestById(_input: {
		id: string;
	}): Promise<ReservationRequest | null> {
		// TODO: Call GraphQL query
		return null;
	}

	/**
	 * Serialize Create input (Date -> ISO string)
	 */
	private serializeCreateInput(input: CreateReservationRequestInput): Record<string, unknown> {
		return {
			...input,
			reservationPeriodStart: input.reservationPeriodStart.toISOString(),
			reservationPeriodEnd: input.reservationPeriodEnd.toISOString(),
		};
	}
}
