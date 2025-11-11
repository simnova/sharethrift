import type { Resolvers } from '../../builder/generated.js';
import { PopulatePersonalUserFromField } from '../../resolver-helper.ts';
import type { GraphContext } from '../../../init/context.ts';

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

			return await context.applicationServices.Listing.ItemListing.cancel({
				id: args.id,
			});
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

			// Get the listing to verify ownership
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});

			if (!listing) {
				throw new Error('Listing not found');
			}

			// Get the current user
			const user =
				await context.applicationServices.User.PersonalUser.queryByEmail({
					email: userEmail,
				});

			if (!user) {
				throw new Error('User not found');
			}

			// Verify ownership
			if (listing.sharer.id !== user.id) {
				throw new Error('You do not have permission to delete this listing');
			}

			// Check if listing has active reservation requests
			const activeReservations =
				await context.applicationServices.ReservationRequest.ReservationRequest.queryActiveByListingId(
					{
						listingId: args.id,
					},
				);

			if (activeReservations && activeReservations.length > 0) {
				throw new Error(
					'Cannot delete listing with active reservation requests. Please cancel or resolve all reservation requests first.',
				);
			}

			// Proceed with deletion
			await context.applicationServices.Listing.ItemListing.update({
				id: args.id,
				isDeleted: true,
			});

			return true;
		},
	},
};

export default itemListingResolvers;
