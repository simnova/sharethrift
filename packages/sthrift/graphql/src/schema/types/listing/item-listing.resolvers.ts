import type { GraphContext } from '../../../init/context.ts';
import type { Domain } from '@sthrift/domain';
import { toGraphItem } from '../../../helpers/mapping.js';
import type { CreateItemListingInput } from '../../builder/generated.js';

interface MyListingsArgs {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sorter?: { field: string; order: 'ascend' | 'descend' };
}

const itemListingResolvers = {
	Query: {
		itemListings: async (
			_parent: unknown,
			_args: unknown,
			context: GraphContext,
		) => {
			const currentUser = context.applicationServices.verifiedUser;
			const user = currentUser?.verifiedJwt?.sub;

			let listings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];

			if (user) {
				listings =
					await context.applicationServices.Listing.ItemListing.queryBySharer({
						personalUser: user,
					});
			} else {
				listings =
					await context.applicationServices.Listing.ItemListing.queryAll({});
			}

			return listings.map(toGraphItem);
		},

		itemListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// Use system services for admin users to allow viewing blocked/appealed listings
			const user = context.applicationServices.verifiedUser;
			const isAdmin = user?.verifiedJwt?.roles?.includes('admin') ?? false;
			
			const services = isAdmin 
				? context.systemApplicationServices 
				: context.applicationServices;
			
			const listing =
				await services.Listing.ItemListing.queryById({
					id: args.id,
				});

			if (!listing) {
				return null;
			}

			return toGraphItem(listing);
		},

		myListingsAll: async (
			_parent: unknown,
			args: MyListingsArgs,
			context: GraphContext,
		) => {
			const currentUser = context.applicationServices.verifiedUser;
			const sharerId = currentUser?.verifiedJwt?.sub;
			const { page, pageSize, searchText, statusFilters, sorter } = args;
			const pagedArgs: {
				page: number;
				pageSize: number;
				searchText?: string;
				statusFilters?: string[];
				sharerId?: string;
				sorter?: { field: string; order: 'ascend' | 'descend' };
			} = { page, pageSize };
			if (searchText !== undefined) {
				pagedArgs.searchText = searchText;
			}
			if (statusFilters !== undefined) {
				pagedArgs.statusFilters = statusFilters;
			}
			if (sorter !== undefined) {
				pagedArgs.sorter = sorter;
			}
			if (sharerId !== undefined) {
				pagedArgs.sharerId = sharerId;
			}
			const result =
				await context.applicationServices.Listing.ItemListing.queryPaged(
					pagedArgs,
				);

			// Map domain ItemListingEntityReference -> GraphQL ListingAll shape
			// ListingAll requires: id, title, image, publishedAt, reservationPeriod, status, pendingRequestsCount
			// Domain entity provides: images, createdAt, sharingPeriodStart/End, state
			// We derive/transform where necessary and guarantee non-null status
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

		return {
			items: result.items.map((
				//biome-ignore lint/suspicious/noExplicitAny: Mongoose document type is dynamic
				listing: any) => {
				const sharingStart = listing.sharingPeriodStart.toISOString();
				const sharingEnd = listing.sharingPeriodEnd.toISOString();
				return {
					id: listing.id,
					title: listing.title,
					image:
					listing.images && listing.images.length > 0
						? listing.images[0]
						: null,
				publishedAt: listing.createdAt.toISOString(),
				reservationPeriod: `${sharingStart.slice(0, 10)} - ${sharingEnd.slice(0, 10)}`,
				status: mapStateToStatus(listing?.state),
					// TODO: integrate with reservation request domain context
					pendingRequestsCount: 0,
				};
				}),
				total: result.total,
				page: result.page,
				pageSize: result.pageSize,
			};
		},

		adminListings: async (
			_parent: unknown,
			args: MyListingsArgs,
			context: GraphContext,
		) => {
			// For now, use queryPaged and constrain statuses to Appealed/Blocked if not provided
			const { page, pageSize, searchText, statusFilters, sorter } = args;
			const effectiveStatuses =
				statusFilters && statusFilters.length > 0
					? statusFilters
					: ['Appeal Requested', 'Blocked'];
			const pagedArgs: {
				page: number;
				pageSize: number;
				searchText?: string;
				statusFilters?: string[];
				sharerId?: string;
				sorter?: { field: string; order: 'ascend' | 'descend' };
			} = { page, pageSize };
		if (searchText !== undefined) pagedArgs.searchText = searchText;
		if (effectiveStatuses !== undefined)
			pagedArgs.statusFilters = effectiveStatuses;
		if (sorter !== undefined) pagedArgs.sorter = sorter;
		const result = await context.systemApplicationServices.Listing.ItemListing.queryPaged(
			pagedArgs,
		);			const mapStateToStatus = (state?: string): string => {
				if (!state || state.trim() === '') return 'Unknown';
				return state;
			};

		return {
			items: result.items.map((
				//biome-ignore lint/suspicious/noExplicitAny: Mongoose document type is dynamic
				listing: any) => {
				const start = listing.sharingPeriodStart.toISOString();
					const end = listing.sharingPeriodEnd.toISOString();
					return {
						id: listing.id,
						title: listing.title,
						image:
							listing.images && listing.images.length > 0
								? listing.images[0]
								: null,
						publishedAt: listing.createdAt?.toISOString?.() ?? null,
						reservationPeriod: `${start.slice(0, 10)} - ${end.slice(0, 10)}`,
						status: mapStateToStatus(listing?.state),
						pendingRequestsCount: 0, // Future: integrate with reservation request domain context
					};
				}),
				total: result.total,
				page: result.page,
				pageSize: result.pageSize,
			};
		},
	},
	Mutation: {
		createItemListing: async (
			_parent: unknown,
			args: { input: CreateItemListingInput },
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

			const result =
				await context.applicationServices.Listing.ItemListing.create(command);
			return toGraphItem(result);
		},

		removeListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// Use system application services for admin operations with system-level permissions
			return await context.systemApplicationServices.Listing.ItemListing.remove({ id: args.id });
		},

		unblockListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// Use system application services for admin operations with system-level permissions
			return await context.systemApplicationServices.Listing.ItemListing.unblock({ id: args.id });
		},
	},
};

export default itemListingResolvers;
