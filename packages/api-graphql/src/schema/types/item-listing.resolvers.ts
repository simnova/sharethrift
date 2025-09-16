import type { GraphContext } from '../../init/context.ts';
import type { Domain } from '@sthrift/api-domain';
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
		itemListings: async (
			_parent: unknown,
			_args: unknown,
			context: GraphContext,
		) => {
			// Get current user from authentication context
			const currentUser = context.applicationServices.verifiedUser;

			const tracer = trace.getTracer('graphql:item-listings');
			return await tracer.startActiveSpan(
				'itemListings.query',
				async (span) => {
					span.setAttribute('operation', 'itemListings');

					let listings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];

					if (currentUser?.verifiedJwt?.sub) {
						// Authenticated user - get their listings
						span.setAttribute('user.id', currentUser.verifiedJwt.sub);
						span.addEvent('Fetching listings for authenticated user');

						listings =
							await context.applicationServices.Listing.ItemListing.queryBySharer(
								{
									personalUser: currentUser.verifiedJwt.sub,
								},
							);
					} else {
						// Unauthenticated user - get all available listings (mock data)
						span.addEvent('Fetching listings for unauthenticated user');
						listings =
							await context.applicationServices.Listing.ItemListing.queryAll(
								{},
							);
					}

					span.setAttribute('listings.count', listings.length);
					span.addEvent('Successfully fetched item listings');
					span.setStatus({ code: SpanStatusCode.OK });

					return listings.map(
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
				},
			);
		},
		itemListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			const tracer = trace.getTracer('graphql:item-listing');
			return await tracer.startActiveSpan('itemListing.query', async (span) => {
				span.setAttribute('operation', 'itemListing');
				span.setAttribute('listing.id', args.id);
				span.addEvent('Fetching item listing by ID');

				try {
					const listing =
						await context.applicationServices.Listing.ItemListing.queryById({
							id: args.id,
						});

					if (!listing) {
						span.setAttribute('result', 'not_found');
						span.setStatus({ code: SpanStatusCode.OK });
						return null;
					}

					span.setAttribute('data.source', 'real_data');
					span.setAttribute('listing.title', listing.title);
					span.addEvent('Successfully fetched item listing');
					span.setStatus({ code: SpanStatusCode.OK });
					return {
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
				} catch (error) {
					span.setAttribute('error.type', 'fetch_error');
					span.addEvent('Error fetching item listing');
					span.setStatus({ code: SpanStatusCode.ERROR });
					throw error;
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
						return {
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
					} catch (error) {
						span.setAttribute('error.type', 'creation_error');
						span.addEvent('Error creating item listing');
						span.setStatus({ code: SpanStatusCode.ERROR });
						throw error;
					}
				},
			);
		},
	},
};

export default itemListingResolvers;
