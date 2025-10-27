import type { GraphContext } from '../../../init/context.ts';
// Domain types not needed in this file after refactor
import { toGraphItem } from '../../../helpers/mapping.js';
import type { CreateItemListingInput } from '../../builder/generated.js';
import { buildPagedArgs } from '@sthrift/application-services';

interface MyListingsArgs {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sorter?: { field: string; order: 'ascend' | 'descend' };
}

// Utility to safely convert date-like values to ISO strings
const getIso = (v: unknown) => {
	try {
		return (v as { toISOString?: () => string })?.toISOString?.() ?? '';
	} catch {
		return '';
	}
};

const itemListingResolvers = {
	Query: {
		myListingsAll: async (
			_parent: unknown,
			args: MyListingsArgs,
			context: GraphContext,
		) => {
			const currentUser = context.applicationServices.verifiedUser;
			const sharerId = currentUser?.verifiedJwt?.sub;
			// Build paged args and include sharerId for personal listings
			const pagedArgs = buildPagedArgs(args);
			if (sharerId !== undefined) pagedArgs.sharerId = sharerId;
			const result = await context.applicationServices.Listing.ItemListing.queryPaged(pagedArgs);

			return {
				items: result.items.map((listing) => {
					// Map listing entity reference directly — mapping helpers removed per request
					type ListingLike = {
						sharingPeriodStart?: unknown;
						sharingPeriodEnd?: unknown;
						images?: string[];
						createdAt?: unknown;
						state?: string;
						id?: string;
						title?: string;
					};
					const l = listing as unknown as ListingLike;
					// use shared getIso helper above
					const start = getIso(l.sharingPeriodStart);
					const end = getIso(l.sharingPeriodEnd);
					const images = l.images;
					const createdAt = getIso(l.createdAt);
					const state = l.state ?? undefined;
					return {
						id: (l.id as string) ?? '',
						title: (l.title as string) ?? '',
						image: images && images.length > 0 ? images[0] : null,
						publishedAt: createdAt || null,
						reservationPeriod: `${start.slice(0, 10)} - ${end.slice(0, 10)}`,
						status: state?.toString?.().trim?.() || 'Unknown',
						pendingRequestsCount: 0,
					};
				}),
				total: result.total,
				page: result.page,
				pageSize: result.pageSize,
			};
		},

		itemListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// Admin-note: role-based authorization should be implemented here (security)
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});

			if (!listing) {
				return null;
			}

			return toGraphItem(listing);
		},



		adminListings: async (_parent: unknown, args: MyListingsArgs, context: GraphContext) => {
			// Admin-note: role-based authorization should be implemented here (security)
			const pagedArgs = buildPagedArgs(args, { useDefaultStatuses: true });
			const result = await context.applicationServices.Listing.ItemListing.queryPaged(pagedArgs);

			return {
				items: result.items.map((listing) => {
					// Map listing entity reference directly — mapping helpers removed per request
					type ListingLike = {
						sharingPeriodStart?: unknown;
						sharingPeriodEnd?: unknown;
						images?: string[];
						createdAt?: unknown;
						state?: string;
						id?: string;
						title?: string;
					};
					const l = listing as unknown as ListingLike;
					// use shared getIso helper above
					const start = getIso(l.sharingPeriodStart);
					const end = getIso(l.sharingPeriodEnd);
					const images = l.images;
					const createdAt = getIso(l.createdAt);
					const state = l.state ?? undefined;
					return {
						id: (l.id as string) ?? '',
						title: (l.title as string) ?? '',
						image: images && images.length > 0 ? images[0] : null,
						publishedAt: createdAt || null,
						reservationPeriod: `${start.slice(0, 10)} - ${end.slice(0, 10)}`,
						status: state?.toString?.().trim?.() || 'Unknown',
						pendingRequestsCount: 0,
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
			// Admin-note: role-based authorization should be implemented here (security)
			// Once implemented, use system-level permissions for admin operations
			return await context.applicationServices.Listing.ItemListing.remove({ id: args.id });
		},

		unblockListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// Admin-note: role-based authorization should be implemented here (security)
			// Once implemented, use system-level permissions for admin operations
			return await context.applicationServices.Listing.ItemListing.unblock({ id: args.id });
		},
	},
};

export default itemListingResolvers;
