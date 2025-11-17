import type { Resolvers } from '../../builder/generated.js';
import { PopulatePersonalUserFromField } from '../../resolver-helper.ts';

const itemListingResolvers: Resolvers = {
	ItemListing: {
		sharer: PopulatePersonalUserFromField('sharer'),
	},
	Query: {
		myListingsAll: async (_parent: unknown, args, context) => {
            const currentUser = context.applicationServices.verifiedUser;
            const email = currentUser?.verifiedJwt?.email;
            let sharerId: string | undefined;
            if(email) {
               sharerId = await context.applicationServices.User.PersonalUser.queryByEmail({email: email}).then(user => user ? user.id : undefined);
            }
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
				...(sharerId && { sharerId }),
			};

			return await context.applicationServices.Listing.ItemListing.queryPaged(
				pagedArgs,
			);
		},
        itemListings: async (_parent, _args, context) => {
			const allListings = await context.applicationServices.Listing.ItemListing.queryAll({});
			// Filter out paused listings from search results for reservers
			// Paused listings should not be visible to reservers
			return allListings.filter(listing => listing.state !== 'Paused');
		},

		itemListing: async (_parent, args, context) => {
			return await context.applicationServices.Listing.ItemListing.queryById({
				id: args.id,
			});
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
		pauseItemListing: async (
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
				await context.applicationServices.Listing.ItemListing.pause({
					id: args.id,
				});
			return result;
		},
	},
};

export default itemListingResolvers;
