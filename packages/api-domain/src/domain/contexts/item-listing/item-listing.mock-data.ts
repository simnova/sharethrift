import { Category, ListingState } from './item-listing.value-objects.ts';

export interface MockItemListingData {
	id: string;
	sharer: string;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state: string;
	thumbnailImage?: string;
}

/**
 * Mock data for testing and development
 */
export const mockListingsData: MockItemListingData[] = [
	{
		id: '1',
		sharer: 'user123',
		title: 'City Bike',
		description: 'A great bike for getting around the city. Well maintained.',
		category: Category.VehiclesTransportation.valueOf(),
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: ListingState.Published.valueOf(),
		thumbnailImage: '/src/assets/item-images/bike.jpg',
	},
	{
		id: '2',
		sharer: 'user456',
		title: 'Cordless Drill',
		description: 'Professional grade cordless drill with battery and charger.',
		category: Category.ToolsEquipment.valueOf(),
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: ListingState.Published.valueOf(),
		thumbnailImage: '/src/assets/item-images/drill.jpg',
	},
	{
		id: '3',
		sharer: 'user789',
		title: 'Hand Mixer',
		description: 'Kitchen hand mixer for baking and cooking needs.',
		category: Category.HomeGarden.valueOf(),
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: ListingState.Published.valueOf(),
		thumbnailImage: '/src/assets/item-images/mixer.jpg',
	},
	{
		id: '4',
		sharer: 'user101',
		title: 'Golf Clubs',
		description: 'Complete set of golf clubs perfect for beginners.',
		category: Category.SportsOutdoors.valueOf(),
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: ListingState.Published.valueOf(),
		thumbnailImage: '/src/assets/item-images/golf-clubs.jpg',
	},
	{
		id: '5',
		sharer: 'user202',
		title: 'Beach Gear',
		description: 'Beach umbrella and chairs for a perfect day at the beach.',
		category: Category.SportsOutdoors.valueOf(),
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: ListingState.Published.valueOf(),
		thumbnailImage: '/src/assets/item-images/beach-gear.jpg',
	},
	{
		id: '6',
		sharer: 'user303',
		title: 'Camping Tent',
		description: '4-person camping tent, great for weekend trips.',
		category: Category.SportsOutdoors.valueOf(),
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: ListingState.Published.valueOf(),
		thumbnailImage: '/src/assets/item-images/tent.jpg',
	},
	{
		id: '7',
		sharer: 'user404',
		title: 'Professional Camera',
		description: 'DSLR camera with multiple lenses for photography enthusiasts.',
		category: Category.Electronics.valueOf(),
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: ListingState.Published.valueOf(),
		thumbnailImage: '/src/assets/item-images/camera.jpg',
	},
	{
		id: '8',
		sharer: 'user505',
		title: 'Portable Speaker',
		description: 'Bluetooth speaker perfect for outdoor events and parties.',
		category: Category.Electronics.valueOf(),
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: ListingState.Published.valueOf(),
		thumbnailImage: '/src/assets/item-images/speaker.jpg',
	},
];

/**
 * Get active mock listings with filtering and pagination
 */
export function getActiveMockListings(options?: {
	search?: string;
	category?: string;
	location?: string;
	skip?: number;
	limit?: number;
}): MockItemListingData[] {
	let filtered = mockListingsData.filter(
		(listing) => listing.state === ListingState.Published.valueOf(),
	);

	// Apply search filter
	if (options?.search) {
		const searchTerm = options.search.toLowerCase();
		filtered = filtered.filter(
			(listing) =>
				listing.title.toLowerCase().includes(searchTerm) ||
				listing.description.toLowerCase().includes(searchTerm) ||
				listing.category.toLowerCase().includes(searchTerm),
		);
	}

	// Apply category filter
	if (options?.category && options.category !== 'All') {
		filtered = filtered.filter((listing) => listing.category === options.category);
	}

	// Apply location filter (placeholder for now)
	if (options?.location) {
		// In a real implementation, this would filter by location
	}

	// Apply pagination
	const skip = options?.skip ?? 0;
	const limit = options?.limit ?? 20;
	return filtered.slice(skip, skip + limit);
}

/**
 * Get a mock listing by ID
 */
export function getMockListingById(id: string): MockItemListingData | undefined {
	return mockListingsData.find((listing) => listing.id === id);
}

/**
 * Get all available categories
 */
export function getAllCategories(): string[] {
	return [
		'All',
		Category.ToolsEquipment.valueOf(),
		Category.Electronics.valueOf(),
		Category.SportsOutdoors.valueOf(),
		Category.HomeGarden.valueOf(),
		Category.PartyEvents.valueOf(),
		Category.VehiclesTransportation.valueOf(),
		Category.KidsBaby.valueOf(),
		Category.BooksMedia.valueOf(),
		Category.ClothingAccessories.valueOf(),
		Category.Miscellaneous.valueOf(),
	];
}