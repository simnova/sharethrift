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
        myActiveReservationForListing: async (
            _parent: unknown,
            args: { listingId: string, userId: string },
            context: GraphContext,
            _info: GraphQLResolveInfo,
        ) => {
            // Ideally would use external id from JWT here
            return await context.applicationServices.ReservationRequest.ReservationRequest.queryActiveByReserverIdAndListingId({
                listingId: args.listingId,
                reserverId: args.userId
            });
        },
        queryActiveByListingId: async (
            _parent: unknown,
            args: { listingId: string },
            context: GraphContext,
            _info: GraphQLResolveInfo,
        ) => {
            return await context.applicationServices.ReservationRequest.ReservationRequest.queryActiveByListingId({
                listingId: args.listingId
            });
        }
    },
	Mutation: {
		createReservationRequest: async (
			_parent: unknown,
			args: { input: { listingId: string; reservationPeriodStart: string; reservationPeriodEnd: string } },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
            const verifiedJwt = context.applicationServices.verifiedUser?.verifiedJwt;
			if (!verifiedJwt) {
				throw new Error('User must be authenticated to create a reservation request');
			}

			return await context.applicationServices.ReservationRequest.ReservationRequest.create({
				listingId: args.input.listingId,
				reservationPeriodStart: new Date(args.input.reservationPeriodStart),
				reservationPeriodEnd: new Date(args.input.reservationPeriodEnd),
				reserverEmail: verifiedJwt.email,
			});
		},
	},
};

export default reservationRequest;
