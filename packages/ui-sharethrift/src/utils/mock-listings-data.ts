// Mock data for frontend development
export interface MockListingData {
	id: string;
	sharer: string;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state: 'Published';
	thumbnailImage: string;
}

export const mockListingsData: MockListingData[] = [
	{
		id: '1',
		sharer: 'user123',
		title: 'City Bike',
		description: 'A great bike for getting around the city. Well maintained and ready to ride.',
		category: 'Vehicles & Transportation',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: 'Published',
		thumbnailImage: '/src/assets/item-images/bike.png',
	},
	{
		id: '2',
		sharer: 'user456',
		title: 'Professional Projector',
		description: 'High-quality projector perfect for presentations and movie nights.',
		category: 'Electronics',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: 'Published',
		thumbnailImage: '/src/assets/item-images/projector.png',
	},
	{
		id: '3',
		sharer: 'user789',
		title: 'Camping Tent',
		description: '4-person camping tent, perfect for weekend outdoor adventures.',
		category: 'Sports & Outdoors',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: 'Published',
		thumbnailImage: '/src/assets/item-images/tent.png',
	},
	{
		id: '4',
		sharer: 'user101',
		title: 'Beach Umbrella',
		description: 'Large beach umbrella to keep you cool on sunny days.',
		category: 'Sports & Outdoors',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: 'Published',
		thumbnailImage: '/src/assets/item-images/umbrella.png',
	},
	{
		id: '5',
		sharer: 'user202',
		title: 'Sewing Machine',
		description: 'Professional sewing machine for all your crafting needs.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: 'Published',
		thumbnailImage: '/src/assets/item-images/sewing-machine.png',
	},
	{
		id: '6',
		sharer: 'user303',
		title: 'Desk Lamp',
		description: 'Adjustable desk lamp perfect for reading and working.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: 'Published',
		thumbnailImage: '/src/assets/item-images/desk-lamp.png',
	},
	{
		id: '7',
		sharer: 'user404',
		title: 'AirPods',
		description: 'Wireless earbuds for music and calls on the go.',
		category: 'Electronics',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: 'Published',
		thumbnailImage: '/src/assets/item-images/airpods.png',
	},
	{
		id: '8',
		sharer: 'user505',
		title: 'String Lights',
		description: 'Decorative string lights perfect for parties and events.',
		category: 'Party & Events',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2025-08-11'),
		sharingPeriodEnd: new Date('2025-12-23'),
		state: 'Published',
		thumbnailImage: '/src/assets/item-images/string-lights.png',
	},
];

export const categories = [
	'All',
	'Tools & Equipment',
	'Electronics',
	'Sports & Outdoors',
	'Home & Garden',
	'Party & Events',
	'Vehicles & Transportation',
	'Kids & Baby',
	'Books & Media',
	'Clothing & Accessories',
	'Miscellaneous',
];

export function getFilteredListings(options?: {
	search?: string;
	category?: string;
	location?: string;
	skip?: number;
	limit?: number;
}): MockListingData[] {
	let filtered = [...mockListingsData];

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