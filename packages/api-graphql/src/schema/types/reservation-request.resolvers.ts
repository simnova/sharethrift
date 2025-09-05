import type { BaseContext } from '@apollo/server';
import type { ApiContextSpec } from '@sthrift/api-context-spec';

interface GraphContext extends BaseContext {
	apiContext?: ApiContextSpec;
}

const reservationRequest = {
	Query: {
		myActiveReservations: async (
			_parent: unknown,
			args: { userId: string },
			_context: GraphContext,
		) => {
			// Mock data for now - will be replaced with calls to application services
			return await Promise.resolve([{
				id: '2',
				state: 'ACCEPTED',
				reservationPeriodStart: '2024-01-25',
				reservationPeriodEnd: '2024-01-30',
				createdAt: '2024-01-12',
				updatedAt: '2024-01-13',
				listing: {
					id: 'listing2',
					sharer: {
						id: 'user-3',
						userType: 'personal',
						isBlocked: false,
						account: {
                            accountType: 'personal',
							email: 'sharer2@example.com',
							username: 'shareruser2',
							profile: {
								firstName: 'Alex',
								lastName: 'Owner',
							},
						},
						schemaVersion: '1',
						createdAt: '2024-01-05T09:00:00Z',
						updatedAt: '2024-01-13T09:00:00Z',
					},
					title: 'Professional Microphone',
					description: 'A high-quality microphone for professional use.',
                    category: 'Electronics',
                    location: 'New York, NY',
					sharingPeriodStart: '2024-01-25T09:00:00Z',
					sharingPeriodEnd: '2024-01-30T18:00:00Z',
					schemaVersion: '1',
                    state: 'Published',
					createdAt: '2024-01-05T09:00:00Z',
					updatedAt: '2024-01-13T09:00:00Z',
				},
				reserver: {
					id: args.userId,
					name: 'John Doe',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-13',
				},
                closeRequestedBySharer: false,
	            closeRequestedByReserver: false,
			}]);
		},
		myPastReservations: async (
			_parent: unknown,
			args: { userId: string },
			_context: GraphContext,
		) => {
			// Mock data for now - will be replaced with calls to application services
			return await Promise.resolve([{
				id: '2',
				state: 'Closed',
				reservationPeriodStart: '2024-01-25',
				reservationPeriodEnd: '2024-01-30',
				createdAt: '2024-01-12',
				updatedAt: '2024-01-13',
				listing: {
					id: 'listing2',
					sharer: {
						id: 'user-3',
						userType: 'personal',
						isBlocked: false,
						account: {
                            accountType: 'personal',
							email: 'sharer2@example.com',
							username: 'shareruser2',
							profile: {
								firstName: 'Alex',
								lastName: 'Owner',
							},
						},
						schemaVersion: '1',
						createdAt: '2024-01-05T09:00:00Z',
						updatedAt: '2024-01-13T09:00:00Z',
					},
					title: 'Professional Microphone',
					description: 'A high-quality microphone for professional use.',
                    category: 'Electronics',
                    location: 'New York, NY',
					sharingPeriodStart: '2024-01-25T09:00:00Z',
					sharingPeriodEnd: '2024-01-30T18:00:00Z',
					schemaVersion: '1',
                    state: 'Published',
					createdAt: '2024-01-05T09:00:00Z',
					updatedAt: '2024-01-13T09:00:00Z',
				},
				reserver: {
					id: args.userId,
					name: 'John Doe',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-13',
				},
                closeRequestedBySharer: false,
	            closeRequestedByReserver: false,
			}]);
		},
	},
	Mutation: {
		cancelReservation: async (
			_parent: unknown,
			args: { id: string },
			_context: GraphContext,
		) => {
			// Mock implementation - will be replaced with actual business logic
			return await Promise.resolve({
				id: args.id,
				state: 'CANCELLED',
				reservationPeriodStart: '2024-01-25',
				reservationPeriodEnd: '2024-01-30',
				createdAt: '2024-01-12',
				updatedAt: '2024-01-13',
				closeRequested: false,
				listing: {
					id: 'listing2',
					sharer: {
						id: 'user-3',
						userType: 'personal',
						isBlocked: false,
						account: {
                            accountType: 'personal',
							email: 'sharer2@example.com',
							username: 'shareruser2',
							profile: {
								firstName: 'Alex',
								lastName: 'Owner',
							},
						},
						schemaVersion: '1',
						createdAt: '2024-01-05T09:00:00Z',
						updatedAt: '2024-01-13T09:00:00Z',
					},
					title: 'Professional Microphone',
					description: 'A high-quality microphone for professional use.',
                    category: 'Electronics',
                    location: 'New York, NY',
					sharingPeriodStart: '2024-01-25T09:00:00Z',
					sharingPeriodEnd: '2024-01-30T18:00:00Z',
					schemaVersion: '1',
                    state: 'Published',
					createdAt: '2024-01-05T09:00:00Z',
					updatedAt: '2024-01-13T09:00:00Z',
				},
				reserver: {
					id: 'reserver-id-2',
					name: 'John Doe',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-13',
				},
                closeRequestedBySharer: false,
	            closeRequestedByReserver: false,
			});
		},
		closeReservation: async (
			_parent: unknown,
			args: { id: string },
			_context: GraphContext,
		) => {
			// Mock implementation - will be replaced with actual business logic
			return await Promise.resolve({
				id: args.id,
				state: 'CLOSED',
				reservationPeriodStart: '2024-01-25',
				reservationPeriodEnd: '2024-01-30',
				createdAt: '2024-01-12',
				updatedAt: '2024-01-13',
				closeRequested: false,
				listing: {
					id: 'listing2',
					sharer: {
						id: 'user-3',
						userType: 'personal',
						isBlocked: false,
						account: {
                            accountType: 'personal',
							email: 'sharer2@example.com',
							username: 'shareruser2',
							profile: {
								firstName: 'Alex',
								lastName: 'Owner',
							},
						},
						schemaVersion: '1',
						createdAt: '2024-01-05T09:00:00Z',
						updatedAt: '2024-01-13T09:00:00Z',
					},
					title: 'Professional Microphone',
					description: 'A high-quality microphone for professional use.',
                    category: 'Electronics',
                    location: 'New York, NY',
					sharingPeriodStart: '2024-01-25T09:00:00Z',
					sharingPeriodEnd: '2024-01-30T18:00:00Z',
					schemaVersion: '1',
                    state: 'Published',
					createdAt: '2024-01-05T09:00:00Z',
					updatedAt: '2024-01-13T09:00:00Z',
				},
				reserver: {
					id: 'reverver-id-4',
					name: 'John Doe',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-13',
				},
                closeRequestedBySharer: false,
	            closeRequestedByReserver: true,
			});
		},
	},
};

export default reservationRequest;
