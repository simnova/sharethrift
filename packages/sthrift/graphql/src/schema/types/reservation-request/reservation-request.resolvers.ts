import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
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
			// Fetch reservation requests for listings owned by sharer from application services
			const command: Parameters<typeof context.applicationServices.ReservationRequest.ReservationRequest.queryListingRequestsBySharerId>[0] = {
				sharerId: args.sharerId,
				page: args.page,
				pageSize: args.pageSize,
				searchText: args.searchText,
				statusFilters: [...(args.statusFilters ?? [])],
			};

			if (args.sorter) {
				command.sorter = {
					field: args.sorter.field || null,
					order: args.sorter.order === 'ascend' || args.sorter.order === 'descend' ? args.sorter.order : null,
				};
			}

			return await context.applicationServices.ReservationRequest.ReservationRequest.queryListingRequestsBySharerId(command);

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
