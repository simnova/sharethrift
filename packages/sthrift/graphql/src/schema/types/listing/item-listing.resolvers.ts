import type { GraphContext } from '../../../init/context.ts';
// Domain types not needed in this file after refactor
import { toGraphItem } from '../../../helpers/mapping.js';
import type { CreateItemListingInput } from '../../builder/generated.js';

interface MyListingsArgs {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sorter?: { field: string; order: 'ascend' | 'descend' };
}

// Small helpers extracted from resolver logic to keep resolvers focused on orchestration
function buildPagedArgs(
	args: MyListingsArgs,
	opts?: { useDefaultStatuses?: boolean },
) {
	const { page, pageSize, searchText, statusFilters, sorter } = args;
		let effectiveStatuses: string[] | undefined;
		if (statusFilters && statusFilters.length > 0) {
			effectiveStatuses = statusFilters;
		} else if (opts?.useDefaultStatuses) {
			effectiveStatuses = ['Appeal Requested', 'Blocked'];
		} else {
			effectiveStatuses = undefined;
		}

	const pagedArgs: Partial<MyListingsArgs> & { page: number; pageSize: number; sharerId?: string } = {
		page,
		pageSize,
	};
	if (searchText) pagedArgs.searchText = searchText;
	if (effectiveStatuses !== undefined) pagedArgs.statusFilters = effectiveStatuses;
	if (sorter) pagedArgs.sorter = sorter;
	return pagedArgs;
}

function mapStateToStatus(state?: string) {
	return state?.toString?.().trim?.() || 'Unknown';
}

function toAdminListing(listing: Record<string, unknown>) {
	const getIso = (v: unknown) => {
		try {
			return (v as { toISOString?: () => string })?.toISOString?.() ?? '';
		} catch {
			return '';
		}
	};

	// Small local shape so we can use dot-notation without `any`.
	type ListingLike = {
		sharingPeriodStart?: unknown;
		sharingPeriodEnd?: unknown;
		images?: string[];
		createdAt?: unknown;
		state?: string;
		id?: string;
		title?: string;
	};
	const l = listing as ListingLike;
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
		status: mapStateToStatus(state),
		pendingRequestsCount: 0,
	};
}

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
				items: result.items.map(
					//biome-ignore lint/suspicious/noExplicitAny: Mongoose document type is dynamic
					(listing: any) => toAdminListing(listing),
				),
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
			// TODO: SECURITY - Add admin role-based authorization check when admin role system is implemented
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
			// TODO: SECURITY - Add admin role-based authorization check when admin role system is implemented
			const pagedArgs = buildPagedArgs(args, { useDefaultStatuses: true });
			const result = await context.applicationServices.Listing.ItemListing.queryPaged(pagedArgs);

			return {
				items: result.items.map(
					//biome-ignore lint/suspicious/noExplicitAny: Mongoose document type is dynamic
					(listing: any) => toAdminListing(listing),
				),
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
			// TODO: SECURITY - Add admin role-based authorization check when admin role system is implemented
			// Once implemented, use system-level permissions for admin operations
			return await context.applicationServices.Listing.ItemListing.remove({ id: args.id });
		},

		unblockListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			// TODO: SECURITY - Add admin role-based authorization check when admin role system is implemented
			// Once implemented, use system-level permissions for admin operations
			return await context.applicationServices.Listing.ItemListing.unblock({ id: args.id });
		},
	},
};

export default itemListingResolvers;
