import { describe, it, expect, beforeEach, vi } from 'vitest';
import reservationRequest from './reservation-request.resolvers.ts';
import type { GraphContext } from '../../../init/context.ts';

describe('Reservation Request Resolvers', () => {
	let mockContext: GraphContext;
	let mockApplicationServices: any;

	beforeEach(() => {
		// Mock application services
		mockApplicationServices = {
			ReservationRequest: {
				ReservationRequest: {
					queryActiveByReserverId: vi.fn(),
					queryPastByReserverId: vi.fn(),
					queryListingRequestsBySharerId: vi.fn(),
					queryActiveByReserverIdAndListingId: vi.fn(),
					queryActiveByListingId: vi.fn(),
					create: vi.fn(),
				},
			},
			verifiedUser: {
				verifiedJwt: {
					email: 'test@example.com',
				},
			},
		};

		mockContext = {
			applicationServices: mockApplicationServices,
		} as unknown as GraphContext;
	});

	describe('Query: myActiveReservations', () => {
		it('should call queryActiveByReserverId with correct userId', async () => {
			const userId = 'test-user-id';
			const mockReservations = [{ id: '1', state: 'Accepted' }];
			mockApplicationServices.ReservationRequest.ReservationRequest.queryActiveByReserverId.mockResolvedValue(
				mockReservations,
			);

			const result = await reservationRequest.Query.myActiveReservations(
				{},
				{ userId },
				mockContext,
				{} as any,
			);

			expect(
				mockApplicationServices.ReservationRequest.ReservationRequest
					.queryActiveByReserverId,
			).toHaveBeenCalledWith({ reserverId: userId });
			expect(result).toEqual(mockReservations);
		});

		it('should return empty array when no active reservations exist', async () => {
			mockApplicationServices.ReservationRequest.ReservationRequest.queryActiveByReserverId.mockResolvedValue(
				[],
			);

			const result = await reservationRequest.Query.myActiveReservations(
				{},
				{ userId: 'test-id' },
				mockContext,
				{} as any,
			);

			expect(result).toEqual([]);
		});
	});

	describe('Query: myPastReservations', () => {
		it('should call queryPastByReserverId with correct userId', async () => {
			const userId = 'test-user-id';
			const mockReservations = [{ id: '1', state: 'Closed' }];
			mockApplicationServices.ReservationRequest.ReservationRequest.queryPastByReserverId.mockResolvedValue(
				mockReservations,
			);

			const result = await reservationRequest.Query.myPastReservations(
				{},
				{ userId },
				mockContext,
				{} as any,
			);

			expect(
				mockApplicationServices.ReservationRequest.ReservationRequest
					.queryPastByReserverId,
			).toHaveBeenCalledWith({ reserverId: userId });
			expect(result).toEqual(mockReservations);
		});
	});

	describe('Query: myListingsRequests', () => {
		it('should call queryListingRequestsBySharerId and paginate results', async () => {
			const sharerId = 'sharer-123';
			const mockRequests = [
				{
					id: '1',
					state: 'Requested',
					createdAt: new Date('2024-01-01'),
					reservationPeriodStart: new Date('2024-02-01'),
					reservationPeriodEnd: new Date('2024-02-10'),
					listing: { title: 'Test Item' },
					reserver: { account: { username: 'testuser' } },
				},
			];
			mockApplicationServices.ReservationRequest.ReservationRequest.queryListingRequestsBySharerId.mockResolvedValue(
				mockRequests,
			);

			const result = await reservationRequest.Query.myListingsRequests(
				{},
				{
					sharerId,
					page: 1,
					pageSize: 10,
					searchText: '',
					statusFilters: [],
				},
				mockContext,
			);

			expect(
				mockApplicationServices.ReservationRequest.ReservationRequest
					.queryListingRequestsBySharerId,
			).toHaveBeenCalledWith({ sharerId });
			expect(result).toHaveProperty('items');
			expect(result).toHaveProperty('total');
			expect(result).toHaveProperty('page', 1);
			expect(result).toHaveProperty('pageSize', 10);
		});

		it('should filter by search text', async () => {
			const mockRequests = [
				{
					id: '1',
					state: 'Requested',
					createdAt: new Date(),
					listing: { title: 'Camera' },
					reserver: { account: { username: 'user1' } },
				},
				{
					id: '2',
					state: 'Requested',
					createdAt: new Date(),
					listing: { title: 'Drone' },
					reserver: { account: { username: 'user2' } },
				},
			];
			mockApplicationServices.ReservationRequest.ReservationRequest.queryListingRequestsBySharerId.mockResolvedValue(
				mockRequests,
			);

			const result = await reservationRequest.Query.myListingsRequests(
				{},
				{
					sharerId: 'sharer-123',
					page: 1,
					pageSize: 10,
					searchText: 'camera',
					statusFilters: [],
				},
				mockContext,
			);

			expect(result.items).toHaveLength(1);
			expect(result.items[0].title).toBe('Camera');
		});

		it('should filter by status', async () => {
			const mockRequests = [
				{
					id: '1',
					state: 'Accepted',
					createdAt: new Date(),
					listing: { title: 'Item 1' },
					reserver: { account: { username: 'user1' } },
				},
				{
					id: '2',
					state: 'Requested',
					createdAt: new Date(),
					listing: { title: 'Item 2' },
					reserver: { account: { username: 'user2' } },
				},
			];
			mockApplicationServices.ReservationRequest.ReservationRequest.queryListingRequestsBySharerId.mockResolvedValue(
				mockRequests,
			);

			const result = await reservationRequest.Query.myListingsRequests(
				{},
				{
					sharerId: 'sharer-123',
					page: 1,
					pageSize: 10,
					searchText: '',
					statusFilters: ['Accepted'],
				},
				mockContext,
			);

			expect(result.items).toHaveLength(1);
			expect(result.items[0].status).toBe('Accepted');
		});
	});

	describe('Query: myActiveReservationForListing', () => {
		it('should call queryActiveByReserverIdAndListingId with correct parameters', async () => {
			const listingId = 'listing-123';
			const userId = 'user-456';
			const mockReservation = { id: '1', state: 'Accepted' };
			mockApplicationServices.ReservationRequest.ReservationRequest.queryActiveByReserverIdAndListingId.mockResolvedValue(
				mockReservation,
			);

			const result =
				await reservationRequest.Query.myActiveReservationForListing(
					{},
					{ listingId, userId },
					mockContext,
					{} as any,
				);

			expect(
				mockApplicationServices.ReservationRequest.ReservationRequest
					.queryActiveByReserverIdAndListingId,
			).toHaveBeenCalledWith({ listingId, reserverId: userId });
			expect(result).toEqual(mockReservation);
		});

		it('should return null when no reservation found', async () => {
			mockApplicationServices.ReservationRequest.ReservationRequest.queryActiveByReserverIdAndListingId.mockResolvedValue(
				null,
			);

			const result =
				await reservationRequest.Query.myActiveReservationForListing(
					{},
					{ listingId: 'listing-123', userId: 'user-456' },
					mockContext,
					{} as any,
				);

			expect(result).toBeNull();
		});
	});

	describe('Query: queryActiveByListingId', () => {
		it('should call queryActiveByListingId with correct listingId', async () => {
			const listingId = 'listing-789';
			const mockReservations = [
				{ id: '1', state: 'Accepted' },
				{ id: '2', state: 'Requested' },
			];
			mockApplicationServices.ReservationRequest.ReservationRequest.queryActiveByListingId.mockResolvedValue(
				mockReservations,
			);

			const result = await reservationRequest.Query.queryActiveByListingId(
				{},
				{ listingId },
				mockContext,
				{} as any,
			);

			expect(
				mockApplicationServices.ReservationRequest.ReservationRequest
					.queryActiveByListingId,
			).toHaveBeenCalledWith({ listingId });
			expect(result).toEqual(mockReservations);
		});
	});

	describe('Mutation: createReservationRequest', () => {
		it('should create a reservation request with valid inputs', async () => {
			const input = {
				listingId: 'listing-123',
				reservationPeriodStart: '2024-02-01T00:00:00Z',
				reservationPeriodEnd: '2024-02-10T00:00:00Z',
			};
			const mockCreatedReservation = { id: 'new-reservation', state: 'Requested' };
			mockApplicationServices.ReservationRequest.ReservationRequest.create.mockResolvedValue(
				mockCreatedReservation,
			);

			const result = await reservationRequest.Mutation.createReservationRequest(
				{},
				{ input },
				mockContext,
				{} as any,
			);

			expect(
				mockApplicationServices.ReservationRequest.ReservationRequest.create,
			).toHaveBeenCalledWith({
				listingId: input.listingId,
				reservationPeriodStart: new Date(input.reservationPeriodStart),
				reservationPeriodEnd: new Date(input.reservationPeriodEnd),
				reserverEmail: 'test@example.com',
			});
			expect(result).toEqual(mockCreatedReservation);
		});

		it('should throw error when user is not authenticated', async () => {
			const input = {
				listingId: 'listing-123',
				reservationPeriodStart: '2024-02-01T00:00:00Z',
				reservationPeriodEnd: '2024-02-10T00:00:00Z',
			};

			// Remove verified user
			mockContext.applicationServices.verifiedUser = undefined as any;

			await expect(
				reservationRequest.Mutation.createReservationRequest(
					{},
					{ input },
					mockContext,
					{} as any,
				),
			).rejects.toThrow(
				'User must be authenticated to create a reservation request',
			);
		});
	});
});
