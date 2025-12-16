import type { GraphContext } from '../../../init/context.ts';
import type { Resolvers } from '../../builder/generated.js';
import { PopulateUserFromField, currentViewerIsAdmin } from '../../resolver-helper.ts';

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
			const listing = await context.applicationServices.Listing.ItemListing.queryById({
				id: args.id,
			});

			// Authorization check: non-admins cannot view blocked listings
			if (listing && listing.state === 'Blocked') {
				const isAdmin = await currentViewerIsAdmin(context);
				if (!isAdmin) {
					return null; // Non-admins cannot access blocked listings
				}
			}

			return listing;
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
			};

			return await context.applicationServices.Listing.ItemListing.create(
				command,
			);
		},

		unblockListing: async (_parent, args, context) => {
			// Authorization check: only admins can unblock listings
			const isAdmin = await currentViewerIsAdmin(context);
			if (!isAdmin) {
				throw new Error('Forbidden: Only administrators can unblock listings');
			}
			const listing = await context.applicationServices.Listing.ItemListing.unblock({
				id: args.id,
			});
			return {
				id: listing.id,
				state: listing.state,
				success: true,
			};
		},
		blockListing: async (_parent, args, context) => {
			// Authorization check: only admins can block listings
			const isAdmin = await currentViewerIsAdmin(context);
			if (!isAdmin) {
				throw new Error('Forbidden: Only administrators can block listings');
			}
			const listing = await context.applicationServices.Listing.ItemListing.block({
				id: args.id,
			});
			return {
				id: listing.id,
				state: listing.state,
				success: true,
			};
		},
		cancelItemListing: async (
			_parent: unknown,
			args: { id: string },
			context,
		) => ({
			status: { success: true },
			listing: await context.applicationServices.Listing.ItemListing.cancel({
				id: args.id,
			}),
		}),

		deleteItemListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			await context.applicationServices.Listing.ItemListing.deleteListings({
				id: args.id,
				userEmail:
					context.applicationServices.verifiedUser?.verifiedJwt?.email ?? '',
			});
			return { status: { success: true } };
		},
	},
};

export default itemListingResolvers;
