import type { GraphQLResolveInfo } from 'graphql';
import type { GraphContext } from '../../../init/context.ts';
import type { Resolvers } from '../../builder/generated.ts';
import {
	PopulateItemListingFromField,
	PopulatePersonalUserFromField,
} from '../../resolver-helper.ts';
type ReservationRequestEntityReference =
	import('@sthrift/domain').Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference;

// Map domain states to UI display states (now 1:1, all aligned)
const DOMAIN_TO_UI_STATE: Record<string, string> = {
	Requested: 'Requested',
	Accepted: 'Accepted',
	Rejected: 'Rejected',
	Cancelled: 'Cancelled',
	Closed: 'Closed',
};

interface ListingRequestDomainShape {
	id: string;
	state?: string;
	createdAt?: Date;
	updatedAt?: Date;
	reservationPeriodStart?: Date;
	reservationPeriodEnd?: Date;
	listing?: { title?: string; [k: string]: unknown };
	reserver?: { account?: { username?: string } };
	[k: string]: unknown; // allow passthrough
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
	[k: string]: unknown; // enable dynamic field sorting access
}

const DUMMY_MY_LISTINGS_SHARER_ID = '507f1f77bcf86cd799439014';

const DEV_DUMMY_LISTING_REQUESTS: ListingRequestDomainShape[] = [
	{
		id: '64f1f77bcf86cd7994390011',
		state: 'Requested',
		createdAt: new Date('2025-01-12T10:00:00.000Z'),
		reservationPeriodStart: new Date('2025-01-20T00:00:00.000Z'),
		reservationPeriodEnd: new Date('2025-01-24T00:00:00.000Z'),
		listing: {
			title: 'Canon EOS R5 Mirrorless Camera',
			thumbnailUrl: '/assets/item-images/camera-r5.png',
			sharer: { id: DUMMY_MY_LISTINGS_SHARER_ID },
		},
		reserver: { account: { username: 'jane.photog' } },
	},
	{
		id: '64f1f77bcf86cd7994390012',
		state: 'Accepted',
		createdAt: new Date('2025-01-10T15:30:00.000Z'),
		reservationPeriodStart: new Date('2025-01-28T00:00:00.000Z'),
		reservationPeriodEnd: new Date('2025-02-02T00:00:00.000Z'),
		listing: {
			title: 'Nanlite MixPanel 150 LED Kit',
			thumbnailUrl: '/assets/item-images/nanlite-mixpanel.png',
			sharer: { id: DUMMY_MY_LISTINGS_SHARER_ID },
		},
		reserver: { account: { username: 'studiojoe' } },
	},
];

const isDevEnvironment = () => {
	const nodeEnv = process.env['NODE_ENV'];
	return (
		nodeEnv === undefined || nodeEnv === 'development' || nodeEnv === 'test'
	);
};

const findDevDummyListingRequestById = (id: string) => {
	if (!isDevEnvironment()) {
		return undefined;
	}
	return DEV_DUMMY_LISTING_REQUESTS.find((request) => request.id === id);
};

const acceptDevDummyListingRequestById = (id: string) => {
	const request = findDevDummyListingRequestById(id);
	if (!request) {
		return undefined;
	}
	request.state = 'Accepted';
	request.updatedAt = new Date();
	return request;
};

const createDummyListingRequestsIfNeeded = (
	requests: ListingRequestDomainShape[],
	sharerId: string,
): ListingRequestDomainShape[] => {
	if (!isDevEnvironment()) {
		return requests;
	}
	if (requests.length > 0) {
		return requests;
	}
	if (sharerId !== DUMMY_MY_LISTINGS_SHARER_ID) {
		return requests;
	}
	return DEV_DUMMY_LISTING_REQUESTS.map((request) => ({
		...request,
		createdAt: new Date(request.createdAt ?? new Date()),
		reservationPeriodStart: new Date(
			request.reservationPeriodStart ?? new Date(),
		),
		reservationPeriodEnd: new Date(request.reservationPeriodEnd ?? new Date()),
	}));
};

const buildAcceptedDummyReservationRequest = (
	request: ListingRequestDomainShape,
): ReservationRequestEntityReference => {
	const now = new Date();
	return {
		...request,
		state: 'Accepted',
		createdAt: new Date(request.createdAt ?? now),
		reservationPeriodStart: new Date(request.reservationPeriodStart ?? now),
		reservationPeriodEnd: new Date(request.reservationPeriodEnd ?? now),
		updatedAt: now,
		schemaVersion: 'dummy-0.0.1',
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		loadListing: async () => request.listing as never,
		loadReserver: async () => request.reserver as never,
	} as unknown as ReservationRequestEntityReference;
};

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

	// Map domain objects into shape expected by client (flatten minimal fields)
	const mapped: ListingRequestUiShape[] = filtered.map((r) => {
		const start =
			r.reservationPeriodStart instanceof Date
				? r.reservationPeriodStart
				: undefined;
		const end =
			r.reservationPeriodEnd instanceof Date
				? r.reservationPeriodEnd
				: undefined;

		// Get the first image from the listing's images array, or use placeholder
		const images = r.listing?.['images'];
		const listingImage =
			Array.isArray(images) && images.length > 0
				? images[0]
				: '/assets/item-images/placeholder.png';

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
			status: DOMAIN_TO_UI_STATE[r.state ?? ''] ?? r.state ?? 'Requested',
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
		reserver: PopulatePersonalUserFromField('reserver'),
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
			const hydratedRequests = createDummyListingRequestsIfNeeded(
				requests as unknown as ListingRequestDomainShape[],
				args.sharerId,
			);
			return paginateAndFilterListingRequests(hydratedRequests, {
				page: args.page,
				pageSize: args.pageSize,
				searchText: args.searchText,
				statusFilters: [...(args.statusFilters ?? [])],
			});
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

			const acceptedDevDummyRequest = acceptDevDummyListingRequestById(
				args.input.id,
			);
			if (acceptedDevDummyRequest) {
				return buildAcceptedDummyReservationRequest(acceptedDevDummyRequest);
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
