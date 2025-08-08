import type { ApiContextSpec } from '@ocom/api-context-spec';

export interface GraphContext {
	apiContext?: ApiContextSpec;
}

export const reservationTypeDefs = `#graphql
  type ReservationRequest {
    id: ID!
    state: ReservationRequestState!
    reservationPeriodStart: String!
    reservationPeriodEnd: String!
    createdAt: String!
    updatedAt: String!
    listingId: ID!
    reserverId: ID!
    closeRequested: Boolean!
    listing: Listing
    reserver: User
  }

  enum ReservationRequestState {
    REQUESTED
    ACCEPTED
    REJECTED
    RESERVATION_PERIOD
    CANCELLED
  }

  type Listing {
    id: ID!
    title: String
    imageUrl: String
  }

  type User {
    id: ID!
    name: String
  }

  extend type Query {
    myReservations(userId: ID!): [ReservationRequest!]!
  }

  extend type Mutation {
    cancelReservation(id: ID!): ReservationRequest
    closeReservation(id: ID!): ReservationRequest
  }
`;

export const reservationResolvers = {
	Query: {
		myReservations: async (_parent: unknown, args: { userId: string }, _context: GraphContext) => {
			// Mock data for now - will be replaced with actual database calls using domain services
			return await Promise.resolve([
				{
					id: '1',
					state: 'REQUESTED',
					reservationPeriodStart: '2024-01-15',
					reservationPeriodEnd: '2024-01-20',
					createdAt: '2024-01-10',
					updatedAt: '2024-01-10',
					listingId: 'listing1',
					reserverId: args.userId,
					closeRequested: false,
					listing: {
						id: 'listing1',
						title: 'Awesome Camera',
						imageUrl: 'https://example.com/camera.jpg'
					},
					reserver: {
						id: args.userId,
						name: 'John Doe'
					}
				},
				{
					id: '2',
					state: 'ACCEPTED',
					reservationPeriodStart: '2024-01-25',
					reservationPeriodEnd: '2024-01-30',
					createdAt: '2024-01-12',
					updatedAt: '2024-01-13',
					listingId: 'listing2',
					reserverId: args.userId,
					closeRequested: false,
					listing: {
						id: 'listing2',
						title: 'Professional Microphone',
						imageUrl: 'https://example.com/microphone.jpg'
					},
					reserver: {
						id: args.userId,
						name: 'John Doe'
					}
				}
			]);
		},
	},
	Mutation: {
		cancelReservation: async (_parent: unknown, args: { id: string }, _context: GraphContext) => {
			// Mock implementation - will be replaced with actual business logic using domain services
			return await Promise.resolve({
				id: args.id,
				state: 'CANCELLED',
				reservationPeriodStart: '2024-01-15',
				reservationPeriodEnd: '2024-01-20',
				createdAt: '2024-01-10',
				updatedAt: new Date().toISOString(),
				listingId: 'listing1',
				reserverId: 'user1',
				closeRequested: false,
			});
		},
		closeReservation: async (_parent: unknown, args: { id: string }, _context: GraphContext) => {
			// Mock implementation - will be replaced with actual business logic using domain services
			return await Promise.resolve({
				id: args.id,
				state: 'RESERVATION_PERIOD',
				reservationPeriodStart: '2024-01-15',
				reservationPeriodEnd: '2024-01-20',
				createdAt: '2024-01-10',
				updatedAt: new Date().toISOString(),
				listingId: 'listing1',
				reserverId: 'user1',
				closeRequested: true,
			});
		},
	},
};