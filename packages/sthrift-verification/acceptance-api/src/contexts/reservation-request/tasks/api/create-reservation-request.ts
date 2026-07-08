import { type Actor, notes, Task } from '@serenity-js/core';
import { GraphQLClient } from '../../../../shared/abilities/graphql-client.ts';
import type { CreateReservationRequestInput, ReservationRequestNotes, ReservationRequestResponse } from '../../abilities/reservation-request-types.ts';

const CREATE_RESERVATION_REQUEST_MUTATION = `
	mutation CreateReservationRequest($input: ReservationRequestCreateInput!) {
		createReservationRequest(input: $input) {
			status { success errorMessage }
			reservationRequest {
				id state reservationPeriodStart reservationPeriodEnd
				listing { id }
				reserver { ... on PersonalUser { id } }
				createdAt updatedAt
			}
		}
	}
`;

const GET_RESERVATION_COUNT_QUERY = `
	query GetReservationRequestsForListing($listingId: ObjectID!) {
		queryActiveByListingId(listingId: $listingId) { id }
	}
`;

export class CreateReservationRequest extends Task {
	static with(input: CreateReservationRequestInput) {
		return new CreateReservationRequest(input);
	}

	private constructor(private readonly input: CreateReservationRequestInput) {
		super(`creates reservation request for listing "${input.listingId}" (api)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const graphql = actor.abilityTo(GraphQLClient);

		const response = await graphql.execute(CREATE_RESERVATION_REQUEST_MUTATION, {
			input: {
				listingId: this.input.listingId,
				reservationPeriodStart: this.input.reservationPeriodStart.toISOString(),
				reservationPeriodEnd: this.input.reservationPeriodEnd.toISOString(),
			},
		});

		const mutationResult = response.data.createReservationRequest as Record<string, unknown>;
		const status = mutationResult.status as Record<string, unknown> | undefined;

		if (status && !status.success) {
			throw new Error(String(status.errorMessage ?? 'Failed to create reservation request'));
		}

		const data = (mutationResult.reservationRequest ?? {}) as Record<string, unknown>;
		const reservationRequest = this.deserialize(data);

		if (!reservationRequest.id) {
			throw new Error('API reservation:create returned a reservation request without an id');
		}
		if (!reservationRequest.state) {
			throw new Error('API reservation:create returned a reservation request without a state');
		}
		if (reservationRequest.state !== 'Requested') {
			throw new Error(`API reservation:create returned state "${reservationRequest.state}", expected "Requested"`);
		}

		// Verify persistence via count query
		const countResponse = await graphql.execute(GET_RESERVATION_COUNT_QUERY, {
			listingId: this.input.listingId,
		});
		const items = countResponse.data.queryActiveByListingId as unknown[];
		const count = Array.isArray(items) ? items.length : 0;

		if (count < 1) {
			throw new Error(`Expected at least 1 reservation request for listing ${this.input.listingId} after creation, but found ${count}`);
		}

		const startDate = reservationRequest.reservationPeriodStart.toISOString().split('T')[0] ?? '';
		const endDate = reservationRequest.reservationPeriodEnd.toISOString().split('T')[0] ?? '';

		await actor.attemptsTo(
			notes<ReservationRequestNotes>().set('lastReservationRequestId', reservationRequest.id),
			notes<ReservationRequestNotes>().set('lastReservationRequestState', reservationRequest.state),
			notes<ReservationRequestNotes>().set('lastReservationRequestStartDate', startDate),
			notes<ReservationRequestNotes>().set('lastReservationRequestEndDate', endDate),
		);
	}

	private deserialize(data: Record<string, unknown>): ReservationRequestResponse {
		const listing = data.listing as Record<string, unknown> | undefined;
		const reserver = data.reserver as Record<string, unknown> | undefined;

		return {
			id: String(data.id),
			listingId: listing ? String(listing.id) : this.input.listingId,
			reserver: this.input.reserver ?? {
				id: reserver ? String(reserver.id) : '',
				email: '',
				firstName: '',
				lastName: '',
			},
			reservationPeriodStart: data.reservationPeriodStart ? new Date(String(data.reservationPeriodStart)) : new Date(),
			reservationPeriodEnd: data.reservationPeriodEnd ? new Date(String(data.reservationPeriodEnd)) : new Date(),
			state: String(data.state) as ReservationRequestResponse['state'],
			createdAt: data.createdAt ? new Date(String(data.createdAt)) : new Date(),
			updatedAt: data.updatedAt ? new Date(String(data.updatedAt)) : new Date(),
		};
	}

	override toString = () => `creates reservation request for listing "${this.input.listingId}" (api)`;
}
