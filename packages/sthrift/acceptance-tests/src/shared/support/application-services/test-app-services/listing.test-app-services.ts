import type { Domain } from '@sthrift/domain';
import {
	createMockListing,
	getAllMockListings,
	getMockListingById,
	listings,
} from '../../test-data/listing.test-data.js';

interface ItemListingCreateCommand {
	sharer: Domain.Contexts.User.UserEntityReference;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	images?: string[];
	isDraft?: boolean;
	expiresAt?: Date;
}

interface ItemListingQueryByIdCommand {
	id: string;
}

interface ItemListingCancelCommand {
	id: string;
}

interface ItemListingUpdateCommand {
	id: string;
}

interface ItemListingUnblockCommand {
	id: string;
}

interface MockListingContextApplicationService {
	ItemListing: {
		create: (command: ItemListingCreateCommand) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
		queryById: (command: ItemListingQueryByIdCommand) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null>;
		queryAll: () => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]>;
		queryBySharer: () => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]>;
		cancel: (command: ItemListingCancelCommand) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
		update: (command: ItemListingUpdateCommand) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
		deleteListings: () => Promise<boolean>;
		unblock: (command: ItemListingUnblockCommand) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
		queryPaged: () => Promise<{ items: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]; total: number; page: number; pageSize: number }>;
	};
}

export function createMockListingService(): MockListingContextApplicationService {
	return {
		ItemListing: {
			create: (command: ItemListingCreateCommand) => {
				const listing = createMockListing({
					sharer: command.sharer,
					title: command.title,
					description: command.description,
					category: command.category,
					location: command.location,
					sharingPeriodStart: command.sharingPeriodStart,
					sharingPeriodEnd: command.sharingPeriodEnd,
					images: command.images || [],
					...(command.isDraft !== undefined && { isDraft: command.isDraft }),
				});
				return Promise.resolve(listing);
			},
			queryById: (command: ItemListingQueryByIdCommand) => {
				return Promise.resolve(getMockListingById(command.id) || null);
			},
			queryAll: () => {
				return Promise.resolve(getAllMockListings());
			},
			queryBySharer: () => Promise.resolve([]),
			cancel: (command: ItemListingCancelCommand) => {
				const listing = getMockListingById(command.id);
				if (!listing) throw new Error(`Listing not found: ${command.id}`);
				return Promise.resolve(listing);
			},
			update: (command: ItemListingUpdateCommand) => {
				const listing = getMockListingById(command.id);
				if (!listing) throw new Error(`Listing not found: ${command.id}`);
				return Promise.resolve(listing);
			},
			deleteListings: async () => true,
			unblock: (command: ItemListingUnblockCommand) => {
				const listing = getMockListingById(command.id);
				if (!listing) throw new Error(`Listing not found: ${command.id}`);
				return Promise.resolve(listing);
			},
			queryPaged: async () => ({
				items: getAllMockListings(),
				total: listings.size,
				page: 1,
				pageSize: 10,
			}),
		},
	};
}
