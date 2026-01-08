import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type { Resolvers } from '../../builder/generated.ts';
import type { QueryMyListingsRequestsArgs } from '../../builder/generated.ts';
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
			args: QueryMyListingsRequestsArgs,
			context: GraphContext,
		) => {
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryListingRequestsBySharerId(
				{
					sharerId: args.sharerId,
					page: args.page,
					pageSize: args.pageSize,
					searchText: args.searchText,
					statusFilters: [...args.statusFilters],
					sorter: {
						field: args.sorter.field,
						order: args.sorter.order,
					},
				},
			);
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
	},
};

export default reservationRequest;
