import type { GraphContext } from '../../../init/context.ts';
import type { Resolvers } from '../../builder/generated.js';
import {
	PopulateUserFromField,
	getUserByEmail,
} from '../../resolver-helper.ts';

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
    ...(args.searchText == null ? {} : { searchText: args.searchText }),
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

// Helper function to verify user authentication
function verifyUserAuthenticated(context: GraphContext): string {
	const userEmail =
		context.applicationServices.verifiedUser?.verifiedJwt?.email;
	if (!userEmail) {
		throw new Error('Authentication required');
	}
	return userEmail;
}

// Helper function to verify listing ownership
function verifyListingOwnership(listing: unknown, currentUserId: string): void {
	const sharerId =
		typeof listing === 'object' && listing !== null && 'sharer' in listing
			? typeof listing.sharer === 'string'
				? listing.sharer
				: (listing.sharer as { id?: string })?.id
			: undefined;

	if (sharerId !== currentUserId) {
		throw new Error('Only the listing owner can perform this action');
	}
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

			// Find the user by email - supports both PersonalUser and AdminUser
			const user = await getUserByEmail(userEmail, context);
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

			return await context.applicationServices.Listing.ItemListing.create(
				command,
			);
		},

		updateItemListing: async (_parent, args, context) => {
			const userEmail = verifyUserAuthenticated(context);
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});
			if (!listing) {
				throw new Error('Listing not found');
			}

			const currentUser = await getUserByEmail(userEmail, context);
			if (!currentUser) {
				throw new Error('User not found');
			}

			verifyListingOwnership(listing, currentUser.id);

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
			const userEmail = verifyUserAuthenticated(context);
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});
			if (!listing) {
				throw new Error('Listing not found');
			}

			const currentUser = await getUserByEmail(userEmail, context);
			if (!currentUser) {
				throw new Error('User not found');
			}

			verifyListingOwnership(listing, currentUser.id);

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
			const userEmail = verifyUserAuthenticated(context);
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});
			if (!listing) {
				throw new Error('Listing not found');
			}

			const currentUser = await getUserByEmail(userEmail, context);
			if (!currentUser) {
				throw new Error('User not found');
			}

			verifyListingOwnership(listing, currentUser.id);

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
			const userEmail = verifyUserAuthenticated(context);
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});
			if (!listing) {
				throw new Error('Listing not found');
			}

			const currentUser = await getUserByEmail(userEmail, context);
			if (!currentUser) {
				throw new Error('User not found');
			}

			verifyListingOwnership(listing, currentUser.id);

			await context.applicationServices.Listing.ItemListing.deleteListings({
				id: args.id,
				userEmail,
			});
			return { status: { success: true } };
		},
	},
};

export default itemListingResolvers;
