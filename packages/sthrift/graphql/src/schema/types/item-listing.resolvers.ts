import type { GraphContext } from '../../init/context.ts';
import type { Resolvers } from '../builder/generated.js';
import { PopulateUserFromField } from '../resolver-helper.ts';

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

			const mapStateToStatus = (state?: string): string => {
				if (!state || state.trim() === '') return 'Unknown';
				switch (state) {
					case 'Published': return 'Active';
					case 'Drafted': return 'Draft';
					case 'Appeal Requested': return 'Appeal_Requested';
					default: return state;
				}
			};

			if (args.searchText && args.searchText.trim() !== '') {
				try {
					const searchInput = {
						searchString: args.searchText,
						options: {
							top: args.pageSize,
							skip: (args.page - 1) * args.pageSize,
							filter: {
								sharerId: sharerId ? [sharerId] : undefined,
								state: args.statusFilters,
							},
							orderBy: args.sorter
								? [`${args.sorter.field} ${args.sorter.order === 'ascend' ? 'asc' : 'desc'}`]
								: ['updatedAt desc'],
						},
					};

					const searchResult =
						await context.applicationServices.Listing.ItemListingSearch.searchItemListings(
							searchInput,
						);

					const items = searchResult.items.map((item) => {
						const sharingStart = new Date(item.sharingPeriodStart).toISOString();
						const sharingEnd = new Date(item.sharingPeriodEnd).toISOString();
						return {
							id: item.id,
							title: item.title,
							image: item.images && item.images.length > 0 ? item.images[0] : null,
							publishedAt: item.createdAt,
							reservationPeriod: `${sharingStart.slice(0, 10)} - ${sharingEnd.slice(0, 10)}`,
							status: mapStateToStatus(item.state),
							pendingRequestsCount: 0,
						};
					});

					return { items, total: searchResult.count, page: args.page, pageSize: args.pageSize };
				} catch (error) {
					console.error('Cognitive search failed, falling back to database query:', error);
				}
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
			return await context.applicationServices.Listing.ItemListing.queryAll({});
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

			try {
				const listing =
					await context.applicationServices.Listing.ItemListing.create(
						command,
					);
				return { status: { success: true }, listing };
			} catch (error) {
				const { message } = error as Error;
				return { status: { success: false, errorMessage: message } };
			}
		},

		unblockListing: async (_parent, args, context) => {
			// Admin-note: role-based authorization should be implemented here (security)
			try {
				await context.applicationServices.Listing.ItemListing.unblock({
					id: args.id,
				});
				return { status: { success: true } };
			} catch (error) {
				const { message } = error as Error;
				return { status: { success: false, errorMessage: message } };
			}
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
