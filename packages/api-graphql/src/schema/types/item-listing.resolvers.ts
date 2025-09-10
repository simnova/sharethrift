import type { GraphContext } from '../../init/context.ts';
import type { Domain } from '@sthrift/api-domain';

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
			if (!currentUser?.verifiedJwt?.sub) {
				throw new Error('Authentication required');
			}

			const listings =
				await context.applicationServices.Listing.ItemListing.queryBySharer({
					personalUser: currentUser.verifiedJwt.sub,
				});

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
		itemListing: async (
			_parent: unknown,
			args: { id: string },
			context: GraphContext,
		) => {
			try {
				const listing =
					await context.applicationServices.Listing.ItemListing.queryById({
						id: args.id,
					});

				if (!listing) {
					return null;
				}

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
				console.error('Error fetching item listing:', error);
				return null;
			}
		},
	},
	Mutation: {
		createItemListing: async (
			_parent: unknown,
			args: { input: CreateItemListingInput },
			context: GraphContext,
		) => {
			const { input } = args;

			// Get current user from authentication context
			const currentUser = context.applicationServices.verifiedUser;
			if (!currentUser?.verifiedJwt?.sub) {
				throw new Error('Authentication required');
			}

			const command = {
				sharerId: currentUser.verifiedJwt.sub,
				title: input.title,
				description: input.description,
				category: input.category,
				location: input.location,
				sharingPeriodStart: new Date(input.sharingPeriodStart),
				sharingPeriodEnd: new Date(input.sharingPeriodEnd),
				images: input.images || [],
			};

			try {
				const result =
					await context.applicationServices.Listing.ItemListing.create(command);

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
				console.error('Error creating item listing:', error);
				throw new Error('Failed to create listing');
			}
		},
	},
};

export default itemListingResolvers;
