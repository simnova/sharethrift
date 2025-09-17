import type { GraphContext } from '../../init/context.ts';
import type { Domain } from '@sthrift/api-domain';
import { withTrace } from '../../helpers/tracing.js';
import { toGraphItem } from '../../helpers/mapping.js';

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
		itemListings: (_parent: unknown, _args: unknown, context: GraphContext) =>
			withTrace('graphql:item-listings', 'itemListings.query', async (span) => {
				const currentUser = context.applicationServices.verifiedUser;
				const user = currentUser?.verifiedJwt?.sub;
				span.setAttribute('user.id', user ?? 'anonymous');

				let listings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];

				if (user) {
					span.addEvent('Fetching listings for authenticated user');
					listings =
						await context.applicationServices.Listing.ItemListing.queryBySharer(
							{
								personalUser: user,
							},
						);
				} else {
					span.addEvent('Fetching listings for unauthenticated user');
					listings =
						await context.applicationServices.Listing.ItemListing.queryAll({});
				}

				span.setAttribute('listings.count', listings.length);
				return listings.map(toGraphItem);
			}),

		itemListing: (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) =>
			withTrace('graphql:item-listing', 'itemListing.query', async (span) => {
				span.setAttribute('listing.id', args.id);
				span.addEvent('Fetching item listing by ID');

				const listing =
					await context.applicationServices.Listing.ItemListing.queryById({
						id: args.id,
					});

				if (!listing) {
					span.setAttribute('result', 'not_found');
					return null;
				}

				span.setAttribute('data.source', 'real_data');
				span.setAttribute('listing.title', listing.title);
				return toGraphItem(listing);
			}),
	},
	Mutation: {
		createItemListing: (
			_parent: unknown,
			args: { input: CreateItemListingInput },
			context: GraphContext,
		) =>
			withTrace(
				'graphql:create-item-listing',
				'createItemListing.mutation',
				async (span) => {
					const userId =
						context.applicationServices.verifiedUser?.verifiedJwt?.sub;
					if (!userId) {
						throw new Error('Authentication required');
					}
					span.setAttribute('user.id', userId);
					span.setAttribute('listing.title', args.input.title);
					span.setAttribute('listing.category', args.input.category);
					span.addEvent('Creating item listing');

					const command = {
						sharerId: userId,
						title: args.input.title,
						description: args.input.description,
						category: args.input.category,
						location: args.input.location,
						sharingPeriodStart: new Date(args.input.sharingPeriodStart),
						sharingPeriodEnd: new Date(args.input.sharingPeriodEnd),
						images: args.input.images ?? [],
						isDraft: args.input.isDraft ?? false,
					};

					const result =
						await context.applicationServices.Listing.ItemListing.create(
							command,
						);
					span.setAttribute('listing.id', result.id);
					return toGraphItem(result);
				},
			),
	},
};

export default itemListingResolvers;
