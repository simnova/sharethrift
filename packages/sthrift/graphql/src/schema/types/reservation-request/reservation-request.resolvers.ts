import type { GraphQLResolveInfo } from 'graphql';
import type { GraphContext } from '../../../init/context.ts';
import type { Resolvers } from '../../builder/generated.ts';
import {
	PopulateItemListingFromField,
	PopulateUserFromField,
} from '../../resolver-helper.ts';

interface ListingRequestDomainShape {
	id: string;
	state?: string;
	createdAt?: Date;
	updatedAt?: Date;
	reservationPeriodStart?: Date;
	reservationPeriodEnd?: Date;
	listing?: {
		title?: string;
		thumbnailUrl?: string;
		images?: string[];
		[k: string]: unknown;
	};
	reserver?: { account?: { username?: string } };
	[k: string]: unknown;
}

interface ListingRequestUiShape {
	id: string;
	title: string;
	image: string;
	requestedBy: string;
	requestedOn: string;
	reservationPeriod: string;
	status: string;
	_raw: ListingRequestDomainShape;
	[k: string]: unknown;
}

function paginateAndFilterListingRequests(
	requests: ListingRequestDomainShape[],
	options: {
		page: number;
		pageSize: number;
		searchText?: string;
		statusFilters: string[];
		sorter?: { field: string | null; order: 'ascend' | 'descend' | null };
	},
) {
	const filtered = [...requests];

	// Map domain objects into shape expected by client
	const mapped: ListingRequestUiShape[] = filtered.map((r) => {
		const start =
			r.reservationPeriodStart instanceof Date
				? r.reservationPeriodStart
				: undefined;
		const end =
			r.reservationPeriodEnd instanceof Date
				? r.reservationPeriodEnd
				: undefined;

		// Get the first image from the listing's images array, fall back to thumbnail, then placeholder
		const images = r.listing?.images;
		const thumbnail =
			typeof r.listing?.thumbnailUrl === 'string'
				? (r.listing?.thumbnailUrl as string)
				: undefined;
		const firstImage =
			Array.isArray(images) && images.length > 0 ? images[0] : undefined;
		const listingImage =
			firstImage ?? thumbnail ?? '/assets/item-images/placeholder.png';

		return {
			id: r.id,
			title: r.listing?.title ?? 'Unknown',
			image: listingImage,
			requestedBy: r.reserver?.account?.username
				? `@${r.reserver.account.username}`
				: '@unknown',
			requestedOn:
				r.createdAt instanceof Date
					? r.createdAt.toISOString()
					: new Date().toISOString(),
			reservationPeriod: `${start ? start.toISOString().slice(0, 10) : 'N/A'} - ${end ? end.toISOString().slice(0, 10) : 'N/A'}`,
			status: r.state ?? 'Requested',
			_raw: r,
		};
	});

	let working = mapped;
	if (options.searchText) {
		const term = options.searchText.toLowerCase();
		working = working.filter((m) => m.title.toLowerCase().includes(term));
	}

	if (options.statusFilters?.length) {
		working = working.filter((m) => options.statusFilters?.includes(m.status));
	}

	if (options.sorter?.field) {
		const { field, order } = options.sorter;
		working.sort((a: ListingRequestUiShape, b: ListingRequestUiShape) => {
			const sortField = field as keyof ListingRequestUiShape;
			const A = a[sortField];
			const B = b[sortField];
			if (A == null) {
				return order === 'ascend' ? -1 : 1;
			}
			if (B == null) {
				return order === 'ascend' ? 1 : -1;
			}
			if (A < B) {
				return order === 'ascend' ? -1 : 1;
			}
			if (A > B) {
				return order === 'ascend' ? 1 : -1;
			}
			return 0;
		});
	}

	const total = working.length;
	const startIndex = (options.page - 1) * options.pageSize;
	const endIndex = startIndex + options.pageSize;
	return {
		items: working.slice(startIndex, endIndex),
		total,
		page: options.page,
		pageSize: options.pageSize,
	};
}

const reservationRequest: Resolvers = {
	ReservationRequest: {
		reserver: PopulateUserFromField('reserver'),
		listing: PopulateItemListingFromField('listing'),
	},

	Query: {
		myActiveReservations: async (
			_parent: unknown,
			args: { userId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryActiveByReserverId(
				{
					reserverId: args.userId,
				},
			);
		},
		myPastReservations: async (
			_parent: unknown,
			args: { userId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryPastByReserverId(
				{
					reserverId: args.userId,
				},
			);
		},
		myListingsRequests: async (
			_parent: unknown,
			args,
			context: GraphContext,
		) => {
			// Fetch reservation requests for listings owned by sharer from application services
			const requests =
				await context.applicationServices.ReservationRequest.ReservationRequest.queryListingRequestsBySharerId(
					{
						sharerId: args.sharerId,
					},
				);
			return paginateAndFilterListingRequests(
				requests as unknown as ListingRequestDomainShape[],
				{
					page: args.page,
					pageSize: args.pageSize,
					searchText: args.searchText,
					statusFilters: [...(args.statusFilters ?? [])],
				},
			);
		},
		myActiveReservationForListing: async (
			_parent,
			args,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			// Ideally would use an id from the JWT instead of passing userId. Or verify the userId
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryActiveByReserverIdAndListingId(
				{
					listingId: args.listingId,
					reserverId: args.userId,
				},
			);
		},
		queryActiveByListingId: async (
			_parent: unknown,
			args: { listingId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryActiveByListingId(
				{
					listingId: args.listingId,
				},
			);
		},
	},
	Mutation: {
		createReservationRequest: async (
			_parent: unknown,
			args: {
				input: {
					listingId: string;
					reservationPeriodStart: string;
					reservationPeriodEnd: string;
				};
			},
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			const verifiedJwt = context.applicationServices.verifiedUser?.verifiedJwt;
			if (!verifiedJwt) {
				throw new Error(
					'User must be authenticated to create a reservation request',
				);
			}

			return await context.applicationServices.ReservationRequest.ReservationRequest.create(
				{
					listingId: args.input.listingId,
					reservationPeriodStart: new Date(args.input.reservationPeriodStart),
					reservationPeriodEnd: new Date(args.input.reservationPeriodEnd),
					reserverEmail: verifiedJwt.email,
				},
			);
		},
		acceptReservationRequest: async (
			_parent: unknown,
			args: {
				input: {
					id: string;
				};
			},
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			const verifiedJwt = context.applicationServices.verifiedUser?.verifiedJwt;
			if (!verifiedJwt) {
				throw new Error(
					'User must be authenticated to accept a reservation request',
				);
			}

			return await context.applicationServices.ReservationRequest.ReservationRequest.accept(
				{
					id: args.input.id,
					sharerEmail: verifiedJwt.email,
				},
			);
		},
	},
};

export default reservationRequest;
