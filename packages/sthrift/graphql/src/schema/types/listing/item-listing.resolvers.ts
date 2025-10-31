import type { GraphContext } from '../../../init/context.ts';
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
		myListingsAll: async (
			_parent: unknown,
			args: MyListingsArgs,
			context: GraphContext,
		) => {
			const currentUser = context.applicationServices.verifiedUser;
			const sharerId = currentUser?.verifiedJwt?.sub;
			
			// Build command args, including sharerId for personal listings
			const command: MyListingsArgs & { sharerId?: string } = {
				page: args.page,
				pageSize: args.pageSize,
			};
			if (args.searchText) command.searchText = args.searchText;
			if (args.statusFilters) command.statusFilters = args.statusFilters;
			if (args.sorter) command.sorter = args.sorter;
			if (sharerId) command.sharerId = sharerId;

			const result = await context.applicationServices.Listing.ItemListing.queryPaged(command);

			// Map domain entities to GraphQL ListingAll type
			return {
				items: result.items.map(listing => {
					const startDate = listing.sharingPeriodStart?.toISOString() ?? '';
					const endDate = listing.sharingPeriodEnd?.toISOString() ?? '';
					const reservationPeriod = startDate && endDate ? `${startDate.slice(0, 10)} - ${endDate.slice(0, 10)}` : '';

					return {
						id: listing.id,
						title: listing.title,
						image: listing.images?.[0] ?? null,
						publishedAt: listing.createdAt?.toISOString() ?? null,
						reservationPeriod,
						status: listing.state || 'Unknown',
						pendingRequestsCount: 0, // TODO: implement pending requests count
					};
				}),
				total: result.total,
				page: result.page,
				pageSize: result.pageSize,
			};
		},

		itemListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// Admin-note: role-based authorization should be implemented here (security)
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});

			if (!listing) {
				return null;
			}

			return toGraphItem(listing);
		},



		adminListings: async (_parent: unknown, args: MyListingsArgs, context: GraphContext) => {
			// Admin-note: role-based authorization should be implemented here (security)
			
			// Build command args with default status filters for admin
			const command: MyListingsArgs = {
				page: args.page,
				pageSize: args.pageSize,
			};
			if (args.searchText) command.searchText = args.searchText;
			if (args.sorter) command.sorter = args.sorter;
			
			// Use provided status filters or default to admin-relevant statuses
			if (args.statusFilters && args.statusFilters.length > 0) {
				command.statusFilters = args.statusFilters;
			} else {
				command.statusFilters = ['Appeal Requested', 'Blocked'];
			}

			const result = await context.applicationServices.Listing.ItemListing.queryPaged(command);

			// Map domain entities to GraphQL ListingAll type
			return {
				items: result.items.map(listing => {
					const startDate = listing.sharingPeriodStart?.toISOString() ?? '';
					const endDate = listing.sharingPeriodEnd?.toISOString() ?? '';
					const reservationPeriod = startDate && endDate ? `${startDate.slice(0, 10)} - ${endDate.slice(0, 10)}` : '';

					return {
						id: listing.id,
						title: listing.title,
						image: listing.images?.[0] ?? null,
						publishedAt: listing.createdAt?.toISOString() ?? null,
						reservationPeriod,
						status: listing.state || 'Unknown',
						pendingRequestsCount: 0, // TODO: implement pending requests count
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
			// Admin-note: role-based authorization should be implemented here (security)
			// Once implemented, use system-level permissions for admin operations
			await context.applicationServices.Listing.ItemListing.update({
				id: args.id,
				isDeleted: true,
			});
			return true;
		},

		unblockListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// Admin-note: role-based authorization should be implemented here (security)
			// Once implemented, use system-level permissions for admin operations
			await context.applicationServices.Listing.ItemListing.update({
				id: args.id,
				isBlocked: false,
			});
			return true;
		},
	},
};

export default itemListingResolvers;
