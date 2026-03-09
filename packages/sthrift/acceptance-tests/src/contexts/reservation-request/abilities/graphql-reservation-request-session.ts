import { GraphqlSession } from '../../../shared/abilities/graphql-session.js';
import type { CreateReservationRequestInput, ReservationRequest } from './reservation-request-session.js';

export class GraphQLReservationRequestSession extends GraphqlSession {
	context = 'reservation';

	constructor(apiUrl: string) {
		super(apiUrl);
		this.registerOperation('reservation:create', (input) =>
			this.handleCreateReservationRequest(input as unknown as CreateReservationRequestInput),
		);
		this.registerOperation('reservation:getCountForListing', (input) =>
			this.handleGetCountForListing(input as unknown as { listingId: string }),
		);
	}

	createReservationRequest(input: CreateReservationRequestInput): Promise<ReservationRequest> {
		return this.execute<CreateReservationRequestInput, ReservationRequest>(
			'reservation:create',
			input,
		);
	}

	getReservationRequestCountForListing(listingId: string): Promise<number> {
		return this.execute<{ listingId: string }, number>(
			'reservation:getCountForListing',
			{ listingId },
		);
	}

	private async handleCreateReservationRequest(
		input: CreateReservationRequestInput,
	): Promise<ReservationRequest> {
		const mutation = `
			mutation CreateReservationRequest($input: CreateReservationRequestInput!) {
				createReservationRequest(input: $input) {
					id
					state
					reservationPeriodStart
					reservationPeriodEnd
					listing {
						id
					}
					reserver {
						... on PersonalUser { id }
						... on AdminUser { id }
					}
					createdAt
					updatedAt
				}
			}
		`;

		const response = await this.executeGraphQL(mutation, {
			input: {
				listingId: input.listingId,
				reservationPeriodStart: input.reservationPeriodStart.toISOString(),
				reservationPeriodEnd: input.reservationPeriodEnd.toISOString(),
			},
		});

		const data = response.data['createReservationRequest'] as Record<string, unknown>;
		return this.deserializeReservationRequest(data, input);
	}

	private async handleGetCountForListing(input: {
		listingId: string;
	}): Promise<number> {
		const query = `
			query GetReservationRequestsForListing($listingId: ObjectID!) {
				queryActiveByListingId(listingId: $listingId) {
					id
				}
			}
		`;

		const response = await this.executeGraphQL(query, { listingId: input.listingId });
		const items = response.data['queryActiveByListingId'] as unknown[];
		return Array.isArray(items) ? items.length : 0;
	}

	private deserializeReservationRequest(
		data: Record<string, unknown>,
		originalInput?: CreateReservationRequestInput,
	): ReservationRequest {
		const listing = data['listing'] as Record<string, unknown> | undefined;
		const reserver = data['reserver'] as Record<string, unknown> | undefined;

		return {
			id: String(data['id']),
			listingId: listing ? String(listing['id']) : (originalInput?.listingId ?? ''),
			reserver: originalInput?.reserver ?? {
				id: reserver ? String(reserver['id']) : '',
				email: '',
				firstName: '',
				lastName: '',
			},
			reservationPeriodStart: data['reservationPeriodStart'] ? new Date(String(data['reservationPeriodStart'])) : new Date(),
			reservationPeriodEnd: data['reservationPeriodEnd'] ? new Date(String(data['reservationPeriodEnd'])) : new Date(),
			state: String(data['state']) as ReservationRequest['state'],
			createdAt: data['createdAt'] ? new Date(String(data['createdAt'])) : new Date(),
			updatedAt: data['updatedAt'] ? new Date(String(data['updatedAt'])) : new Date(),
		};
	}
}
