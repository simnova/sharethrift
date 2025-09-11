import type { GraphContext } from '../../init/context.ts';
import type { Domain } from '@sthrift/api-domain';
import { DUMMY_LISTINGS } from './mock-listings.ts';
import { trace, SpanStatusCode } from '@opentelemetry/api';

function mapState(state?: string) {
	return state === 'Appeal Requested' ? 'Appeal_Requested' : state;
}

interface CreateItemListingInput {
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: string;
	sharingPeriodEnd: string;
	images?: string[];
	isDraft?: boolean;
}

const itemListingResolvers = {
	Query: {
		itemListings: (_parent: unknown, _args: unknown, context: GraphContext) => {
			// Get current user from authentication context
			const currentUser = context.applicationServices.verifiedUser;
			if (!currentUser?.verifiedJwt?.sub) {
				throw new Error('Authentication required');
			}

			const tracer = trace.getTracer('graphql:item-listings');
			return tracer.startActiveSpan('itemListings.query', async (span) => {
				span.setAttribute('operation', 'itemListings');
				if (currentUser?.verifiedJwt?.sub) {
					span.setAttribute('user.id', currentUser.verifiedJwt.sub);
				}
				span.addEvent('Starting item listings query');

				try {
					const listings =
						await context.applicationServices.Listing.ItemListing.queryBySharer(
							{
								personalUser: currentUser?.verifiedJwt?.sub || '',
							},
						);

					// If no real listings exist, return dummy data
					if (!listings || listings.length === 0) {
						span.setAttribute('fallback.reason', 'no_real_data');
						span.setAttribute('fallback.type', 'dummy_data');
						span.setAttribute('dummy.count', DUMMY_LISTINGS.length);
						span.addEvent('No real listings found, using dummy data');
						span.setStatus({ code: SpanStatusCode.OK });
						const result = DUMMY_LISTINGS.map((listing) => ({
							sharer: listing.sharer,
							title: listing.title,
							description: listing.description,
							category: listing.category,
							location: listing.location,
							sharingPeriodStart: listing.sharingPeriodStart.toISOString(),
							sharingPeriodEnd: listing.sharingPeriodEnd.toISOString(),
							state: mapState(listing.state),
							sharingHistory: listing.sharingHistory || [],
							reports: listing.reports || 0,
							images: listing.images || [],
							id: listing._id,
							schemaVersion: '1.0',
							createdAt:
								listing.createdAt?.toISOString() || new Date().toISOString(),
							updatedAt:
								listing.updatedAt?.toISOString() || new Date().toISOString(),
							version: 1,
						}));
						return result;
					}

					span.setAttribute('data.source', 'real_data');
					span.setAttribute('listings.count', listings.length);
					span.addEvent('Successfully fetched real listings');
					span.setStatus({ code: SpanStatusCode.OK });
					const result = listings.map(
						(
							listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
						) => ({
							sharer: listing.sharer.id,
							title: listing.title,
							description: listing.description,
							category: listing.category,
							location: listing.location,
							sharingPeriodStart: listing.sharingPeriodStart.toISOString(),
							sharingPeriodEnd: listing.sharingPeriodEnd.toISOString(),
							state: mapState(listing.state),
							sharingHistory: listing.sharingHistory || [],
							reports: listing.reports || 0,
							images: listing.images || [],
							id: listing.id,
							schemaVersion: listing.schemaVersion,
							createdAt: listing.createdAt.toISOString(),
							updatedAt: listing.updatedAt.toISOString(),
							version: 1,
						}),
					);
					return result;
				} catch (_error) {
					span.setAttribute('fallback.reason', 'real_data_error');
					span.setAttribute('fallback.type', 'dummy_data');
					span.addEvent(
						'Falling back to dummy listings data due to error fetching real data',
					);
					span.setStatus({ code: SpanStatusCode.OK });
					// Return dummy data as fallback
					const result = DUMMY_LISTINGS.map((listing) => ({
						sharer: listing.sharer,
						title: listing.title,
						description: listing.description,
						category: listing.category,
						location: listing.location,
						sharingPeriodStart: listing.sharingPeriodStart.toISOString(),
						sharingPeriodEnd: listing.sharingPeriodEnd.toISOString(),
						state: mapState(listing.state),
						sharingHistory: listing.sharingHistory || [],
						reports: listing.reports || 0,
						images: listing.images || [],
						id: listing._id,
						schemaVersion: '1.0',
						createdAt:
							listing.createdAt?.toISOString() || new Date().toISOString(),
						updatedAt:
							listing.updatedAt?.toISOString() || new Date().toISOString(),
						version: 1,
					}));
					return result;
				}
			});
		},
		itemListing: (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			const tracer = trace.getTracer('graphql:item-listing');
			return tracer.startActiveSpan('itemListing.query', async (span) => {
				span.setAttribute('operation', 'itemListing');
				span.setAttribute('listing.id', args.id);
				span.addEvent('Fetching item listing by ID');

				try {
					const listing =
						await context.applicationServices.Listing.ItemListing.queryById({
							id: args.id,
						});

					if (!listing) {
						// Try to find in dummy data
						const dummyListing = DUMMY_LISTINGS.find((l) => l._id === args.id);
						if (dummyListing) {
							span.setAttribute('fallback.reason', 'real_listing_not_found');
							span.setAttribute('fallback.type', 'dummy_data');
							span.addEvent('Real listing not found, using dummy data');
							span.setStatus({ code: SpanStatusCode.OK });
							const result = {
								sharer: dummyListing.sharer,
								title: dummyListing.title,
								description: dummyListing.description,
								category: dummyListing.category,
								location: dummyListing.location,
								sharingPeriodStart:
									dummyListing.sharingPeriodStart.toISOString(),
								sharingPeriodEnd: dummyListing.sharingPeriodEnd.toISOString(),
								state: mapState(dummyListing.state),
								sharingHistory: dummyListing.sharingHistory || [],
								reports: dummyListing.reports || 0,
								images: dummyListing.images || [],
								id: dummyListing._id,
								schemaVersion: '1.0',
								createdAt:
									dummyListing.createdAt?.toISOString() ||
									new Date().toISOString(),
								updatedAt:
									dummyListing.updatedAt?.toISOString() ||
									new Date().toISOString(),
								version: 1,
							};
							return result;
						}
						span.setAttribute('result', 'not_found');
						span.setStatus({ code: SpanStatusCode.OK });
						return null;
					}

					span.setAttribute('data.source', 'real_data');
					span.setAttribute('listing.title', listing.title);
					span.setAttribute('listing.category', listing.category);
					span.addEvent('Successfully fetched real listing');
					span.setStatus({ code: SpanStatusCode.OK });
					const result = {
						sharer: listing.sharer.id,
						title: listing.title,
						description: listing.description,
						category: listing.category,
						location: listing.location,
						sharingPeriodStart: listing.sharingPeriodStart.toISOString(),
						sharingPeriodEnd: listing.sharingPeriodEnd.toISOString(),
						state: mapState(listing.state),
						sharingHistory: listing.sharingHistory || [],
						reports: listing.reports || 0,
						images: listing.images || [],
						id: listing.id,
						schemaVersion: listing.schemaVersion,
						createdAt: listing.createdAt.toISOString(),
						updatedAt: listing.updatedAt.toISOString(),
						version: 1,
					};
					return result;
				} catch (_error) {
					span.setAttribute('error.type', 'fetch_error');
					span.addEvent('Error fetching item listing');
					span.setStatus({ code: SpanStatusCode.ERROR });
					return null;
				}
			});
		},
	},
	Mutation: {
		createItemListing: (
			_parent: unknown,
			args: { input: CreateItemListingInput },
			context: GraphContext,
		) => {
			const currentUser = context.applicationServices.verifiedUser;
			if (!currentUser?.verifiedJwt?.sub) {
				throw new Error('Authentication required');
			}

			const tracer = trace.getTracer('graphql:create-item-listing');
			return tracer.startActiveSpan(
				'createItemListing.mutation',
				async (span) => {
					span.setAttribute('operation', 'createItemListing');
					if (currentUser?.verifiedJwt?.sub) {
						span.setAttribute('user.id', currentUser.verifiedJwt.sub);
					}
					span.setAttribute('listing.title', args.input.title);
					span.setAttribute('listing.category', args.input.category);
					span.addEvent('Creating item listing');

					const command = {
						sharerId: currentUser?.verifiedJwt?.sub || '',
						title: args.input.title,
						description: args.input.description,
						category: args.input.category,
						location: args.input.location,
						sharingPeriodStart: new Date(args.input.sharingPeriodStart),
						sharingPeriodEnd: new Date(args.input.sharingPeriodEnd),
						images: args.input.images || [],
					};

					try {
						const result =
							await context.applicationServices.Listing.ItemListing.create(
								command,
							);

						span.setAttribute('listing.id', result.id);
						span.addEvent('Successfully created item listing');
						span.setStatus({ code: SpanStatusCode.OK });
						const response = {
							sharer: result.sharer.id,
							title: result.title,
							description: result.description,
							category: result.category,
							location: result.location,
							sharingPeriodStart: result.sharingPeriodStart.toISOString(),
							sharingPeriodEnd: result.sharingPeriodEnd.toISOString(),
							state: mapState(result.state),
							sharingHistory: result.sharingHistory || [],
							reports: result.reports || 0,
							images: result.images || [],
							id: result.id,
							schemaVersion: result.schemaVersion,
							createdAt: result.createdAt.toISOString(),
							updatedAt: result.updatedAt.toISOString(),
							version: 1,
						};
						return response;
					} catch (_error) {
						span.setAttribute('error.type', 'creation_error');
						span.addEvent('Error creating item listing');
						span.setStatus({ code: SpanStatusCode.ERROR });
						throw new Error('Failed to create listing');
					}
				},
			);
		},
	},
};

export default itemListingResolvers;
