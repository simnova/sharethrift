import type { GraphContext } from '../../../init/context.ts';
import type {
	Resolvers,
	QueryMyListingsAllArgs,
	QueryAdminListingsArgs,
	QueryItemListingArgs,
	MutationCreateItemListingArgs,
	MutationRemoveListingArgs,
	MutationUnblockListingArgs,
} from '../../builder/generated.js';


const itemListingResolvers: Resolvers<GraphContext> = {
	Query: {
		myListingsAll: async (_parent: unknown, args: QueryMyListingsAllArgs, context: GraphContext) => {
			const sharerId = context.applicationServices.verifiedUser?.verifiedJwt?.sub;

			type PagedArgs = {
				page: number;
				pageSize: number;
				searchText?: string;
				statusFilters?: string[];
				sorter?: { field: string; order: 'ascend' | 'descend' };
				sharerId?: string;
			};

			const pagedArgs: PagedArgs = {
				page: args.page,
				pageSize: args.pageSize,
				...(args.searchText != null ? { searchText: args.searchText } : {}),
				...(args.statusFilters != null ? { statusFilters: [...args.statusFilters] } : {}),
				...(args.sorter != null ? { sorter: { field: args.sorter.field, order: args.sorter.order as 'ascend' | 'descend' } } : {}),
				...(sharerId && { sharerId }),
			};

			return await context.applicationServices.Listing.ItemListing.queryPaged(pagedArgs);
		},

		itemListing: async (_parent: unknown, args: QueryItemListingArgs, context: GraphContext) => {
			// Admin-note: role-based authorization should be implemented here (security)
			return await context.applicationServices.Listing.ItemListing.queryById({
				id: args.id,
			});
		},
		adminListings: async (_parent: unknown, args: QueryAdminListingsArgs, context: GraphContext) => {
			// Admin-note: role-based authorization should be implemented here (security)
			type PagedArgs = {
				page: number;
				pageSize: number;
				searchText?: string;
				statusFilters?: string[];
				sorter?: { field: string; order: 'ascend' | 'descend' };
			};

			const pagedArgs: PagedArgs = {
				page: args.page,
				pageSize: args.pageSize,
				...(args.searchText != null ? { searchText: args.searchText } : {}),
				...(args.statusFilters != null ? { statusFilters: [...args.statusFilters] } : {}),
				...(args.sorter != null ? { sorter: { field: args.sorter.field, order: args.sorter.order as 'ascend' | 'descend' } } : {}),
			};

			return await context.applicationServices.Listing.ItemListing.queryPaged(pagedArgs);
		},
	},
	Mutation: {
		createItemListing: async (_parent: unknown, args: MutationCreateItemListingArgs, context: GraphContext) => {
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

			const result = await context.applicationServices.Listing.ItemListing.create(command);
			// Return the domain entity reference directly — generated types expect the domain reference
			return result;
		},

		removeListing: async (_parent: unknown, args: MutationRemoveListingArgs, context: GraphContext) => {
			// Admin-note: role-based authorization should be implemented here (security)
			// Once implemented, use system-level permissions for admin operations
			await context.applicationServices.Listing.ItemListing.update({
				id: args.id,
				isDeleted: true,
			});
			return true;
		},

		unblockListing: async (_parent: unknown, args: MutationUnblockListingArgs, context: GraphContext) => {
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
