import type { GraphContext } from '../../../init/context.ts';
import type { Domain } from '@sthrift/domain';
import { toGraphItem } from '../../../helpers/mapping.js';
import type { CreateItemListingInput } from '../../builder/generated.js';

interface MyListingsArgs {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sorter?: { field: string; order: 'ascend' | 'descend' };
}

const itemListingResolvers = {
	Query: {
		itemListings: async (
			_parent: unknown,
			_args: unknown,
			context: GraphContext,
		) => {
			const currentUser = context.applicationServices.verifiedUser;
			const user = currentUser?.verifiedJwt?.sub;

			let listings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];

			if (user) {
				listings =
					await context.applicationServices.Listing.ItemListing.queryBySharer({
						personalUser: user,
					});
			} else {
				listings =
					await context.applicationServices.Listing.ItemListing.queryAll({});
			}

			return listings.map(toGraphItem);
		},

		itemListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// TODO: SECURITY - Add admin role-based authorization check when admin role system is implemented
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});

			if (!listing) {
				return null;
			}

			return toGraphItem(listing);
		},

		myListingsAll: async (
			_parent: unknown,
			args: MyListingsArgs,
			context: GraphContext,
		) => {
			const currentUser = context.applicationServices.verifiedUser;
			const sharerId = currentUser?.verifiedJwt?.sub;
			const { page, pageSize, searchText, statusFilters, sorter } = args;
			const pagedArgs: {
				page: number;
				pageSize: number;
				searchText?: string;
				statusFilters?: string[];
				sharerId?: string;
				sorter?: { field: string; order: 'ascend' | 'descend' };
			} = { page, pageSize };
			if (searchText !== undefined) {
				pagedArgs.searchText = searchText;
			}
			if (statusFilters !== undefined) {
				pagedArgs.statusFilters = statusFilters;
			}
			if (sorter !== undefined) {
				pagedArgs.sorter = sorter;
			}
			if (sharerId !== undefined) {
				pagedArgs.sharerId = sharerId;
			}
			const result =
				await context.applicationServices.Listing.ItemListing.queryPaged(
					pagedArgs,
				);

			return {
				items: result.items.map((
					//biome-ignore lint/suspicious/noExplicitAny: Mongoose document type is dynamic
					listing: any) => {
					const sharingStart = listing.sharingPeriodStart.toISOString();
					const sharingEnd = listing.sharingPeriodEnd.toISOString();
					return {
						id: listing.id,
						title: listing.title,
						image:
						listing.images && listing.images.length > 0
							? listing.images[0]
							: null,
					publishedAt: listing.createdAt.toISOString(),
					reservationPeriod: `${sharingStart.slice(0, 10)} - ${sharingEnd.slice(0, 10)}`,
					status: listing?.state || 'Unknown',
						// TODO: integrate with reservation request domain context
						pendingRequestsCount: 0,
					};
					}),
					total: result.total,
					page: result.page,
					pageSize: result.pageSize,
				};
		},

		adminListings: async (
			_parent: unknown,
			args: MyListingsArgs,
			context: GraphContext,
		) => {
			// TODO: SECURITY - Add admin role-based authorization check when admin role system is implemented
			const { page, pageSize, searchText, statusFilters, sorter } = args;
			const pagedArgs: {
				page: number;
				pageSize: number;
				searchText?: string;
				statusFilters?: string[];
				sorter?: { field: string; order: 'ascend' | 'descend' };
			} = { page, pageSize };
			if (searchText !== undefined) pagedArgs.searchText = searchText;
			if (statusFilters !== undefined) pagedArgs.statusFilters = statusFilters;
			if (sorter !== undefined) pagedArgs.sorter = sorter;
			
			const result = await context.applicationServices.Listing.ItemListing.queryPaged(
				pagedArgs,
			);

			return {
				items: result.items.map((
					//biome-ignore lint/suspicious/noExplicitAny: Mongoose document type is dynamic
					listing: any) => {
					const start = listing.sharingPeriodStart.toISOString();
					const end = listing.sharingPeriodEnd.toISOString();
					return {
						id: listing.id,
						title: listing.title,
						image:
							listing.images && listing.images.length > 0
								? listing.images[0]
								: null,
						publishedAt: listing.createdAt?.toISOString?.() ?? null,
						reservationPeriod: `${start.slice(0, 10)} - ${end.slice(0, 10)}`,
						status: listing?.state || 'Unknown',
						pendingRequestsCount: 0,
					};
				}),
				total: result.total,
				page: result.page,
				pageSize: result.pageSize,
			};
		},
	},
	Mutation: {
		createItemListing: async (
			_parent: unknown,
			args: { input: CreateItemListingInput },
			context: GraphContext,
		) => {
			const userEmail =
				context.applicationServices.verifiedUser?.verifiedJwt?.email;
			if (!userEmail) {
				throw new Error('Authentication required');
			}

			// Find the user by email to get their database ID
			const user =
				await context.applicationServices.User.PersonalUser.queryByEmail({
					email: userEmail,
				});
			if (!user) {
				throw new Error(`User not found for email ${userEmail}`);
			}

			const command = {
				sharer: user,
				title: args.input.title,
				description: args.input.description,
				category: args.input.category,
				location: args.input.location,
				sharingPeriodStart: new Date(args.input.sharingPeriodStart),
				sharingPeriodEnd: new Date(args.input.sharingPeriodEnd),
				images: [...(args.input.images ?? [])],
				isDraft: args.input.isDraft ?? false,
			};

			const result =
				await context.applicationServices.Listing.ItemListing.create(command);
			return toGraphItem(result);
		},

		removeListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// TODO: SECURITY - Add admin role-based authorization check when admin role system is implemented
			// Once implemented, use system-level permissions for admin operations
			return await context.applicationServices.Listing.ItemListing.remove({ id: args.id });
		},

		unblockListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// TODO: SECURITY - Add admin role-based authorization check when admin role system is implemented
			// Once implemented, use system-level permissions for admin operations
			return await context.applicationServices.Listing.ItemListing.unblock({ id: args.id });
		},
	},
};

export default itemListingResolvers;
