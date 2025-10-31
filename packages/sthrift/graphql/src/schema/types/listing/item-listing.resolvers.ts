import type { GraphContext } from '../../../init/context.ts';
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
			const sharerId = context.applicationServices.verifiedUser?.verifiedJwt?.sub;
			return await context.applicationServices.Listing.ItemListing.queryPaged({
				...args,
				...(sharerId && { sharerId }),
			});
		},

		itemListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// Admin-note: role-based authorization should be implemented here (security)
			return await context.applicationServices.Listing.ItemListing.queryById({
				id: args.id,
			});
		},

		adminListings: async (_parent: unknown, args: MyListingsArgs, context: GraphContext) => {
			// Admin-note: role-based authorization should be implemented here (security)
			return await context.applicationServices.Listing.ItemListing.queryPaged(args);
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
