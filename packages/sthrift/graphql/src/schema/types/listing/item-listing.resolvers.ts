import type { GraphContext } from '../../../init/context.ts';
import type { Resolvers } from '../../builder/generated.js';
import { PopulateUserFromField } from '../../resolver-helper.ts';

// Helper type for paged arguments
export type PagedArgs = {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sorter?: { field: string; order: 'ascend' | 'descend' };
	sharerId?: string;
};

// Helper function to construct pagedArgs
function buildPagedArgs(
	args: {
		page: number;
		pageSize: number;
		searchText?: string | null;
		statusFilters?: readonly string[] | null;
		sorter?: { field: string; order: string } | null;
	},
	extra?: Partial<PagedArgs>,
): PagedArgs {
  return {
    page: args.page,
    pageSize: args.pageSize,
    ...(args.searchText != null ? { searchText: args.searchText } : {}),
    ...(args.statusFilters ? { statusFilters: [...args.statusFilters] } : {}),
    ...(args.sorter
      ? {
          sorter: {
            field: args.sorter.field,
            order: args.sorter.order as 'ascend' | 'descend',
          },
        }
      : {}),
    ...extra,
  };
}

const itemListingResolvers: Resolvers = {
	ItemListing: {
		sharer: PopulateUserFromField('sharer'),
	},
	Query: {
		myListingsAll: async (_parent: unknown, args, context) => {
			const currentUser = context.applicationServices.verifiedUser;
			const email = currentUser?.verifiedJwt?.email;
			let sharerId: string | undefined;
			if (email) {
				sharerId =
					await context.applicationServices.User.PersonalUser.queryByEmail({
						email: email,
					}).then((user) => (user ? user.id : undefined));
			}

			const pagedArgs = buildPagedArgs(args, sharerId ? { sharerId } : {});

			return await context.applicationServices.Listing.ItemListing.queryPaged(
				pagedArgs,
			);
		},
		itemListings: async (_parent, _args, context) => {
			return await context.applicationServices.Listing.ItemListing.queryAll({});
		},

		itemListing: async (_parent, args, context) => {
			return await context.applicationServices.Listing.ItemListing.queryById({
				id: args.id,
			});
		},
		adminListings: async (_parent, args, context) => {
			// Admin-note: role-based authorization should be implemented here (security)
			const pagedArgs = buildPagedArgs(args);

			return await context.applicationServices.Listing.ItemListing.queryPaged(
				pagedArgs,
			);
		},
	},
	Mutation: {
		createItemListing: async (_parent, args, context) => {
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
				listingType: 'item-listing',
			};

			return await context.applicationServices.Listing.ItemListing.create(
				command,
			);
		},

		updateItemListing: async (_parent, args, context) => {
			const userEmail =
				context.applicationServices.verifiedUser?.verifiedJwt?.email;
			if (!userEmail) {
				throw new Error('Authentication required');
			}

			// Verify the user is the listing owner
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});
			if (!listing) {
				throw new Error('Listing not found');
			}

			const currentUser =
				await context.applicationServices.User.PersonalUser.queryByEmail({
					email: userEmail,
				});
			if (!currentUser) {
				throw new Error('User not found');
			}

			// Check if the current user is the sharer (owner) of the listing
			const sharerId =
				typeof listing.sharer === 'string'
					? listing.sharer
					: listing.sharer?.id;
			if (sharerId !== currentUser.id) {
				throw new Error('Only the listing owner can update this listing');
			}

			const command: {
				id: string;
				title?: string;
				description?: string;
				category?: string;
				location?: string;
				sharingPeriodStart?: Date;
				sharingPeriodEnd?: Date;
				images?: string[];
			} = {
				id: args.id,
			};

			if (args.input.title !== undefined && args.input.title !== null) {
				command.title = args.input.title;
			}
			if (
				args.input.description !== undefined &&
				args.input.description !== null
			) {
				command.description = args.input.description;
			}
			if (args.input.category !== undefined && args.input.category !== null) {
				command.category = args.input.category;
			}
			if (args.input.location !== undefined && args.input.location !== null) {
				command.location = args.input.location;
			}
			if (
				args.input.sharingPeriodStart !== undefined &&
				args.input.sharingPeriodStart !== null
			) {
				command.sharingPeriodStart = new Date(args.input.sharingPeriodStart);
			}
			if (
				args.input.sharingPeriodEnd !== undefined &&
				args.input.sharingPeriodEnd !== null
			) {
				command.sharingPeriodEnd = new Date(args.input.sharingPeriodEnd);
			}
			if (args.input.images !== undefined && args.input.images !== null) {
				command.images = [...args.input.images];
			}

			return await context.applicationServices.Listing.ItemListing.update(
				command,
			);
		},

		pauseItemListing: async (_parent, args, context) => {
			const userEmail =
				context.applicationServices.verifiedUser?.verifiedJwt?.email;
			if (!userEmail) {
				throw new Error('Authentication required');
			}

			// Verify the user is the listing owner
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});
			if (!listing) {
				throw new Error('Listing not found');
			}

			const currentUser =
				await context.applicationServices.User.PersonalUser.queryByEmail({
					email: userEmail,
				});
			if (!currentUser) {
				throw new Error('User not found');
			}

			// Check if the current user is the sharer (owner) of the listing
			const sharerId =
				typeof listing.sharer === 'string'
					? listing.sharer
					: listing.sharer?.id;
			if (sharerId !== currentUser.id) {
				throw new Error('Only the listing owner can pause this listing');
			}

			return await context.applicationServices.Listing.ItemListing.pause({
				id: args.id,
			});
		},

		unblockListing: async (_parent, args, context) => {
			// Admin-note: role-based authorization should be implemented here (security)
			await context.applicationServices.Listing.ItemListing.unblock({
				id: args.id,
			});
			return true;
		},
		cancelItemListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			const userEmail =
				context.applicationServices.verifiedUser?.verifiedJwt?.email;
			if (!userEmail) {
				throw new Error('Authentication required');
			}

			// Verify the user is the listing owner
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});
			if (!listing) {
				throw new Error('Listing not found');
			}

			const currentUser =
				await context.applicationServices.User.PersonalUser.queryByEmail({
					email: userEmail,
				});
			if (!currentUser) {
				throw new Error('User not found');
			}

			// Check if the current user is the sharer (owner) of the listing
			const sharerId =
				typeof listing.sharer === 'string'
					? listing.sharer
					: listing.sharer?.id;
			if (sharerId !== currentUser.id) {
				throw new Error('Only the listing owner can cancel this listing');
			}

			return {
				status: { success: true },
				listing: await context.applicationServices.Listing.ItemListing.cancel({
					id: args.id,
				}),
			};
		},

		deleteItemListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			const userEmail =
				context.applicationServices.verifiedUser?.verifiedJwt?.email;
			if (!userEmail) {
				throw new Error('Authentication required');
			}

			// Verify the user is the listing owner
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});
			if (!listing) {
				throw new Error('Listing not found');
			}

			const currentUser =
				await context.applicationServices.User.PersonalUser.queryByEmail({
					email: userEmail,
				});
			if (!currentUser) {
				throw new Error('User not found');
			}

			// Check if the current user is the sharer (owner) of the listing
			const sharerId =
				typeof listing.sharer === 'string'
					? listing.sharer
					: listing.sharer?.id;
			if (sharerId !== currentUser.id) {
				throw new Error('Only the listing owner can delete this listing');
			}

			await context.applicationServices.Listing.ItemListing.deleteListings({
				id: args.id,
				userEmail,
			});
			return { status: { success: true } };
		},
	},
};

export default itemListingResolvers;
