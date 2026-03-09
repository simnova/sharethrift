import { Domain } from '@sthrift/domain';
import { generateObjectId } from './utils.js';

type ItemListingEntityReference = Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;

export const listings = new Map<string, ItemListingEntityReference>();

interface CreateListingInput {
	sharer: Domain.Contexts.User.UserEntityReference;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	images?: string[];
	isDraft?: boolean;
}

export function createMockListing(input: CreateListingInput): ItemListingEntityReference {
	const { Title, Description, Category, Location } =
		Domain.Contexts.Listing.ItemListing.ItemListingValueObjects;

	// Validate using real domain value objects
	const title = new Title(input.title).valueOf();
	const description = new Description(input.description).valueOf();
	const category = new Category(input.category).valueOf();
	const location = new Location(input.location).valueOf();

	const id = generateObjectId();
	const state = input.isDraft ? 'Draft' : 'Active';

	const listing: ItemListingEntityReference = {
		id,
		sharer: input.sharer,
		title,
		description,
		category,
		location,
		sharingPeriodStart: input.sharingPeriodStart,
		sharingPeriodEnd: input.sharingPeriodEnd,
		state,
		images: input.images ?? [],
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
		listingType: 'item-sharing',
		isBlocked: false,
		hasReports: false,
		loadSharer: async () => input.sharer,
		loadListing: async () => null as never,
		loadReserver: async () => null as never,
	} as unknown as ItemListingEntityReference;

	listings.set(id, listing);
	return listing;
}

export function getMockListingById(id: string): ItemListingEntityReference | null {
	return listings.get(id) ?? null;
}

export function getAllMockListings(): ItemListingEntityReference[] {
	return Array.from(listings.values());
}

export function clearMockListings(): void {
	listings.clear();
}
