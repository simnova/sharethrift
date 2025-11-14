import type { Resolvers } from '../../builder/generated.js';
import { PopulatePersonalUserFromField } from '../../resolver-helper.ts';

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

const itemListingResolvers: Resolvers = {
	ItemListing: {
		sharer: PopulatePersonalUserFromField('sharer'),
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
				const user = await context.applicationServices.User.PersonalUser.queryByEmail({
					email,
				});
				sharerId = user ? user.id : sharerId;
			}

		const { page, pageSize, searchText, statusFilters, sorter } = args;

		// Use the service method that handles search-vs-database flow
		const result = await context.applicationServices.Listing.ItemListing.queryPagedWithSearchFallback(
			{
				page,
				pageSize,
				...(searchText ? { searchText } : {}),
				...(statusFilters ? { statusFilters: [...statusFilters] } : {}),
				...(sorter ? { sorter: { field: sorter.field, order: sorter.order as 'ascend' | 'descend' } } : {}),
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
		adminListings: async (_parent, args, context) => {
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
				...(args.statusFilters != null
					? { statusFilters: [...args.statusFilters] }
					: {}),
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

		removeListing: async (_parent, args, context) => {
			// Admin-note: role-based authorization should be implemented here (security)
			// Once implemented, use system-level permissions for admin operations
			await context.applicationServices.Listing.ItemListing.update({
				id: args.id,
				isDeleted: true,
			});
			return true;
		},

		unblockListing: async (_parent, args, context) => {
			// Admin-note: role-based authorization should be implemented here (security)
			// Once implemented, use system-level permissions for admin operations
			await context.applicationServices.Listing.ItemListing.update({
				id: args.id,
				isBlocked: false,
			});
			return true;
		},
		cancelItemListing: async (
			_parent: unknown,
			args: { id: string },
			context,
		) => {
			const userEmail =
				context.applicationServices.verifiedUser?.verifiedJwt?.email;
			if (!userEmail) {
				throw new Error('Authentication required');
			}

			const result =
				await context.applicationServices.Listing.ItemListing.cancel({
					id: args.id,
				});
			return result
		},
	},
};

export default itemListingResolvers;
