import type { GraphContext } from '../../../init/context.ts';
import type { Resolvers } from '../../builder/generated.js';
import { PopulateUserFromField } from '../../resolver-helper.ts';

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

			const command: Parameters<typeof context.applicationServices.Listing.ItemListing.queryPaged>[0] = {
				page: args.page,
				pageSize: args.pageSize,
				...(args.searchText ? { searchText: args.searchText } : {}),
				...(args.statusFilters ? { statusFilters: [...args.statusFilters] } : {}),
			};

			if (args.sorter) {
				command.sorter = {
					field: args.sorter.field,
					order: args.sorter.order === 'ascend' || args.sorter.order === 'descend' ? args.sorter.order : "ascend",
				};
			}

			if (sharerId) {
				command.sharerId = sharerId;
			}

			return await context.applicationServices.Listing.ItemListing.queryPaged(command);
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
			const command: Parameters<typeof context.applicationServices.Listing.ItemListing.queryPaged>[0] = {
				page: args.page,
				pageSize: args.pageSize,
				...(args.searchText ? { searchText: args.searchText } : {}),
				...(args.statusFilters ? { statusFilters: [...args.statusFilters] } : {}),
			};

			if (args.sorter) {
				command.sorter = {
					field: args.sorter.field,
					order: args.sorter.order === 'ascend' || args.sorter.order === 'descend' ? args.sorter.order : "ascend",
				};
			}

			return await context.applicationServices.Listing.ItemListing.queryPaged(command);
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
