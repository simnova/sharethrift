import { ApiSession } from '../../../shared/abilities/api-session.ts';
import type { CreateReservationRequestInput, ReservationRequestResponse } from './reservation-request-types.ts';

export abstract class ApiReservationRequestSession extends ApiSession {
	context = 'reservation';

	constructor(apiUrl: string, authToken?: string) {
		super(apiUrl, authToken);
		this.registerOperations();
	}

	protected registerOperations(): void {
		this.registerOperation('reservation:create', (input) =>
			this.handleCreateReservationRequest(input as CreateReservationRequestInput),
		);
		this.registerOperation('reservation:getCountForListing', (input) =>
			this.handleGetCountForListing(input as { listingId: string }),
		);
	}

	createReservationRequest(input: CreateReservationRequestInput): Promise<ReservationRequestResponse> {
		return this.execute<CreateReservationRequestInput, ReservationRequestResponse>(
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

	protected async handleCreateReservationRequest(
		input: CreateReservationRequestInput,
	): Promise<ReservationRequestResponse> {
		const mutation = `
			mutation CreateReservationRequest($input: ReservationRequestCreateInput!) {
				createReservationRequest(input: $input) {
					status {
						success
						errorMessage
					}
					reservationRequest {
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
			}
		`;

		const response = await this.executeGraphQL(mutation, {
			input: {
				listingId: input.listingId,
				reservationPeriodStart: input.reservationPeriodStart.toISOString(),
				reservationPeriodEnd: input.reservationPeriodEnd.toISOString(),
			},
		});

		const mutationResult = response.data['createReservationRequest'] as Record<string, unknown>;
		const status = mutationResult['status'] as Record<string, unknown> | undefined;

		if (status && !status['success']) {
			throw new Error(String(status['errorMessage'] ?? 'Failed to create reservation request'));
		}

		const data = (mutationResult['reservationRequest'] ?? {}) as Record<string, unknown>;
		return this.deserializeReservationRequest(data, input);
	}

	protected async handleGetCountForListing(input: {
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
		const items = response.data['queryActiveByListingId'] as Record<string, unknown>[];
		return Array.isArray(items) ? items.length : 0;
	}

	protected deserializeReservationRequest(
		data: Record<string, unknown>,
		originalInput?: CreateReservationRequestInput,
	): ReservationRequestResponse {
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
			state: String(data['state']) as ReservationRequestResponse['state'],
			createdAt: data['createdAt'] ? new Date(String(data['createdAt'])) : new Date(),
			updatedAt: data['updatedAt'] ? new Date(String(data['updatedAt'])) : new Date(),
		};
	}
}
