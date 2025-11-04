import type { GraphContext } from '../../../init/context.ts';
import type {
	Resolvers,
	QueryMyListingsAllArgs,
	QueryAdminListingsArgs,
	QueryItemListingArgs,
	MutationCreateItemListingArgs,
	MutationRemoveListingArgs,
	MutationUnblockListingArgs,
} from '../../builder/generated.ts';

const mapStateToStatus = (state?: string): string => {
	if (!state || state.trim() === '') {
		return 'Unknown';
	}
	// Normalize internal domain states to UI statuses
	switch (state) {
		case 'Published':
			return 'Active';
		case 'Drafted':
			return 'Draft';
		case 'Appeal Requested':
			return 'Appeal_Requested';
		default:
			return state; // Paused, Cancelled, Expired, Blocked, Reserved (future), etc.
	}
};

const itemListingResolvers: Resolvers<GraphContext> = {
	Query: {
		myListingsAll: async (
			_parent: unknown,
			args: QueryMyListingsAllArgs,
			context: GraphContext,
		) => {
			const currentUser = context.applicationServices.verifiedUser;
			const sharerId = currentUser?.verifiedJwt?.sub;
			const { page, pageSize, searchText, statusFilters, sorter } = args;

			// Use the service method that handles search-vs-database flow
			const result = await context.applicationServices.Listing.ItemListing.queryPagedWithSearchFallback(
				{
					page,
					pageSize,
					searchText,
					statusFilters,
					sorter,
					...(sharerId ? { sharerId } : {}),
				},
			);

			// Convert domain entities to GraphQL format
			const items = result.items.map((item) => {
				const sharingStart = new Date(
					item.sharingPeriodStart,
				).toISOString();
				const sharingEnd = new Date(item.sharingPeriodEnd).toISOString();

				return {
					id: item.id,
					title: item.title,
					image:
						item.images && item.images.length > 0 ? item.images[0] : null,
					publishedAt: item.createdAt,
					reservationPeriod: `${sharingStart.slice(0, 10)} - ${sharingEnd.slice(0, 10)}`,
					status: mapStateToStatus(item.state),
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

		itemListing: async (
			_parent: unknown,
			args: QueryItemListingArgs,
			context: GraphContext,
		) => {
			// Admin-note: role-based authorization should be implemented here (security)
			return await context.applicationServices.Listing.ItemListing.queryById({
				id: args.id,
			});
		},

		adminListings: async (
			_parent: unknown,
			args: QueryAdminListingsArgs,
			context: GraphContext,
		) => {
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
				...(args.sorter != null
					? {
						sorter: {
							field: args.sorter.field,
							order: args.sorter.order as 'ascend' | 'descend',
						},
					}
					: {}),
			};

			return await context.applicationServices.Listing.ItemListing.queryPaged(
				pagedArgs,
			);
		},
	},
	Mutation: {
		createItemListing: async (
			_parent: unknown,
			args: MutationCreateItemListingArgs,
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

			// Return the domain entity reference directly — generated types expect the domain reference
			return await context.applicationServices.Listing.ItemListing.create(command);
		},

		removeListing: async (
			_parent: unknown,
			args: MutationRemoveListingArgs,
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
			args: MutationUnblockListingArgs,
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
