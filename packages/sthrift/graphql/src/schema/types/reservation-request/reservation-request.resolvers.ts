import type { GraphQLResolveInfo } from 'graphql';
import type { GraphContext } from '../../../init/context.ts';
import type { Resolvers } from '../../builder/generated.ts';
import {
	PopulateItemListingFromField,
	PopulateUserFromField,
} from '../../resolver-helper.ts';

const reservationRequest: Resolvers = {
	ReservationRequest: {
		reserver: PopulateUserFromField('reserver'),
		listing: PopulateItemListingFromField('listing'),
	},
	Query: {
		myActiveReservations: async (
			_parent: unknown,
			args: { userId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryActiveByReserverId(
				{
					reserverId: args.userId,
				},
			);
		},
		myPastReservations: async (
			_parent: unknown,
			args: { userId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryPastByReserverId(
				{
					reserverId: args.userId,
				},
			);
		},
		myListingsRequests: async (
			_parent: unknown,
			args,
			context: GraphContext,
		) => {
			// Fetch reservation requests for listings owned by sharer
			const requests =
				await context.applicationServices.ReservationRequest.ReservationRequest.queryListingRequestsBySharerId(
					{
						sharerId: args.sharerId,
					},
				);

			// Return raw data - let GraphQL schema and UI handle any transformation
			return requests ?? [];
		},
		myActiveReservationForListing: async (
			_parent,
			args,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// Ideally would use an id from the JWT instead of passing userId. Or verify the userId
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryActiveByReserverIdAndListingId(
				{
					listingId: args.listingId,
					reserverId: args.userId,
				},
			);
		},
		queryActiveByListingId: async (
			_parent: unknown,
			args: { listingId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryActiveByListingId(
				{
					listingId: args.listingId,
				},
			);
		},
	},
	Mutation: {
		createReservationRequest: async (
			_parent: unknown,
			args: {
				input: {
					listingId: string;
					reservationPeriodStart: string;
					reservationPeriodEnd: string;
				};
			},
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			const verifiedJwt = context.applicationServices.verifiedUser?.verifiedJwt;
			if (!verifiedJwt) {
				throw new Error(
					'User must be authenticated to create a reservation request',
				);
			}

			return await context.applicationServices.ReservationRequest.ReservationRequest.create(
				{
					listingId: args.input.listingId,
					reservationPeriodStart: new Date(args.input.reservationPeriodStart),
					reservationPeriodEnd: new Date(args.input.reservationPeriodEnd),
					reserverEmail: verifiedJwt.email,
				},
			);
		},
		acceptReservationRequest: async (
			_parent: unknown,
			args: {
				input: {
					id: string;
				};
			},
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			const verifiedJwt = context.applicationServices.verifiedUser?.verifiedJwt;
			if (!verifiedJwt) {
				throw new Error(
					'User must be authenticated to accept a reservation request',
				);
			}

			// Delegate to application service - domain layer handles authorization via passport/visa
			// The PersonalUserPassport is already set up with the authenticated user
			// When update calls reservationRequest.state = 'Accepted', the domain aggregate
			// checks permissions via the visa pattern (PersonalUserReservationRequestVisa)
			// which validates that the current user is the listing sharer
			return await context.applicationServices.ReservationRequest.ReservationRequest.update(
				{
					id: args.input.id,
					state: 'Accepted',
				},
			);
		},
	},
};

export default reservationRequest;
