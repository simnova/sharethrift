import type { GraphContext } from '../../init/context.ts';
import type { Domain } from '@sthrift/api-domain';
import { toGraphItem } from '../../helpers/mapping.js';

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
			const listing =
				await context.applicationServices.Listing.ItemListing.queryById({
					id: args.id,
				});

			if (!listing) {
				return null;
			}

			return toGraphItem(listing);
		},
	},
	Mutation: {
		createItemListing: async (
			_parent: unknown,
			args: { input: CreateItemListingInput },
			context: GraphContext,
		) => {
			const userId = context.applicationServices.verifiedUser?.verifiedJwt?.sub;
			if (!userId) {
				throw new Error('Authentication required');
			}

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
				await context.applicationServices.Listing.ItemListing.create(command);
			return toGraphItem(result);
		},
	},
};

export default itemListingResolvers;
