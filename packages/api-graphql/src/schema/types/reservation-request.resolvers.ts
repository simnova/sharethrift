import type { GraphContext } from '../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';

const reservationRequest = {
	Query: {
		myActiveReservations: async (
			_parent: unknown,
			args: { userId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryActiveByReserverId({
                reserverId: args.userId
            });
		},
		myPastReservations: async (
			_parent: unknown,
			args: { userId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryPastByReserverId({
                reserverId: args.userId
            });
		},
	},
	Mutation: {
		createReservationRequest: async (
			_parent: unknown,
			args: { input: { listingId: string; reservationPeriodStart: string; reservationPeriodEnd: string } },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// Get the current user ID from the JWT context
			const currentUserId = context.applicationServices.verifiedUser?.verifiedJwt?.sub;
			if (!currentUserId) {
				throw new Error('User must be authenticated to create a reservation request');
			}

			return await context.applicationServices.ReservationRequest.ReservationRequest.create({
				listingId: args.input.listingId,
				reservationPeriodStart: new Date(args.input.reservationPeriodStart),
				reservationPeriodEnd: new Date(args.input.reservationPeriodEnd),
				reserverId: currentUserId,
			});
		},
	},
};

export default reservationRequest;
