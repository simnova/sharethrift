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

const itemListingResolvers: Resolvers = {
	ItemListing: {
		sharer: PopulateUserFromField('sharer'),
	},
	Query: {
		itemListings: async (_parent, _args, context) => {
			return await context.applicationServices.Listing.ItemListing.queryAll({});
		},

		itemListing: async (_parent, args, context) => {
			return await context.applicationServices.Listing.ItemListing.queryById({
				id: args.id,
			});
		},

		myListingsAll: async (_parent: unknown, args, context) => {
			const currentUser = context.applicationServices.verifiedUser;
			const email = currentUser?.verifiedJwt?.email;
			let sharerId: string | undefined =
				context.applicationServices.verifiedUser?.verifiedJwt?.sub;
			if (email) {
				const user =
					await context.applicationServices.User.PersonalUser.queryByEmail({
						email,
					});
				sharerId = user ? user.id : sharerId;
			}

			const { page, pageSize, searchText, statusFilters, sorter } = args;

			// Use the service method that handles search-vs-database flow
			const result =
				await context.applicationServices.Listing.ItemListing.queryPagedWithSearchFallback(
					{
						page,
						pageSize,
						...(searchText ? { searchText } : {}),
						...(statusFilters ? { statusFilters: [...statusFilters] } : {}),
						...(sorter
							? {
									sorter: {
										field: sorter.field,
										order: sorter.order as 'ascend' | 'descend',
									},
								}
							: {}),
						...(sharerId ? { sharerId } : {}),
					},
				);

			// Convert domain entities to GraphQL format
			const items = result.items.map((item) => {
				const sharingStart = new Date(item.sharingPeriodStart).toISOString();
				const sharingEnd = new Date(item.sharingPeriodEnd).toISOString();

			return {
				id: item.id,
				title: item.title,
				image: item.images && item.images.length > 0 ? item.images[0] : null,
				publishedAt: item.createdAt,
				reservationPeriod: `${sharingStart.slice(0, 10)} - ${sharingEnd.slice(0, 10)}`,
				status: item.state || 'Unknown',
				pendingRequestsCount: 0, // TODO: integrate reservation request counts
			};
			});

			return {
				items,
				total: result.total,
				page: result.page,
				pageSize: result.pageSize,
			};
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
			// Admin-note: role-based authorization should be implemented here (security)
			await context.applicationServices.Listing.ItemListing.unblock({
				id: args.id,
			});
			return true;
		},
		cancelItemListing: async (
			_parent: unknown,
			args: { id: string },
			context,
		) => {
			const listing = await context.applicationServices.Listing.ItemListing.cancel({
				id: args.id,
			});
			return {
				status: { success: true },
				listing,
			};
		},

		deleteItemListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			const listing = await context.applicationServices.Listing.ItemListing.queryById({
				id: args.id,
			});
			await context.applicationServices.Listing.ItemListing.deleteListings({
				id: args.id,
				userEmail:
					context.applicationServices.verifiedUser?.verifiedJwt?.email ?? '',
			});
			return {
				status: { success: true },
				listing,
			};
		},
	},
};

export default itemListingResolvers;
