import type { Resolvers } from '../../builder/generated.js';
import {
	PopulateUserFromField,
	getUserByEmail,
} from '../../resolver-helper.ts';

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
				const user = await getUserByEmail(email, context);
				if (user) {
					sharerId = user.id;
				}
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
				...(args.searchText ? { searchText: args.searchText } : {}),
				...(args.statusFilters
					? { statusFilters: [...args.statusFilters] }
					: {}),
				...(args.sorter
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
			return await context.applicationServices.Listing.ItemListing.queryAll({});
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
				...(args.searchText ? { searchText: args.searchText } : {}),
				...(args.statusFilters
					? { statusFilters: [...args.statusFilters] }
					: {}),
				...(args.sorter
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

			// Find the user by email (supports both PersonalUser and AdminUser)
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
			if (args.input.description !== undefined && args.input.description !== null) {
				command.description = args.input.description;
			}
			if (args.input.category !== undefined && args.input.category !== null) {
				command.category = args.input.category;
			}
			if (args.input.location !== undefined && args.input.location !== null) {
				command.location = args.input.location;
			}
			if (args.input.sharingPeriodStart !== undefined && args.input.sharingPeriodStart !== null) {
				command.sharingPeriodStart = new Date(args.input.sharingPeriodStart);
			}
			if (args.input.sharingPeriodEnd !== undefined && args.input.sharingPeriodEnd !== null) {
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

			return await context.applicationServices.Listing.ItemListing.pause({
				id: args.id,
			});
		},

		deleteItemListing: async (_parent, args, context) => {
			const userEmail =
				context.applicationServices.verifiedUser?.verifiedJwt?.email;
			if (!userEmail) {
				throw new Error('Authentication required');
			}

			return await context.applicationServices.Listing.ItemListing.update({
				id: args.id,
				isDeleted: true,
			});
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

			return await context.applicationServices.Listing.ItemListing.cancel({
				id: args.id,
			});
		},
	},
};

export default itemListingResolvers;
