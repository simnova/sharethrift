import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

const createItemListing = (options: {
	id: string;
	sharerId: string;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingStart: string;
	sharingEnd: string;
	state: string;
	createdDate: string;
	images: string[];
}) => ({
	_id: new ObjectId(options.id),
	sharer: new ObjectId(options.sharerId),
	title: options.title,
	description: options.description,
	category: options.category,
	location: options.location,
	sharingPeriodStart: new Date(options.sharingStart),
	sharingPeriodEnd: new Date(options.sharingEnd),
	state: options.state,
	createdAt: new Date(options.createdDate),
	updatedAt: new Date(options.createdDate),
	sharingHistory: [],
	reports: 0,
	images: options.images,
	schemaVersion: '1.0.0',
	version: 1,
	listingType: 'item-listing',
});

export const itemListings = [
	createItemListing({
		id: '707f1f77bcf86cd799439031',
		sharerId: '507f1f77bcf86cd799439011', // Alice
		title: 'Fan',
		description: 'A reliable fan for your house.',
		category: 'Garden',
		location: 'Springfield, IL',
		sharingStart: '2023-04-01T08:00:00Z',
		sharingEnd: '2023-04-30T20:00:00Z',
		state: 'Published',
		createdDate: '2023-03-25T09:00:00Z',
		images: ['/assets/item-images/fan.png'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439032',
		sharerId: '507f1f77bcf86cd799439012', // Bob
		title: 'Mountain Bike',
		description: 'A sturdy mountain bike for off-road adventures.',
		category: 'Sports',
		location: 'Springfield, IL',
		sharingStart: '2023-05-01T08:00:00Z',
		sharingEnd: '2023-05-31T20:00:00Z',
		state: 'Published',
		createdDate: '2023-04-20T10:00:00Z',
		images: ['/assets/item-images/bike.png'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439033',
		sharerId: '507f1f77bcf86cd799439011', // Alice
		title: 'City Bike',
		description: 'Perfect city bike for commuting and leisure rides around the neighborhood.',
		category: 'Vehicles',
		location: 'Philadelphia, PA',
		sharingStart: '2024-08-11T08:00:00Z',
		sharingEnd: '2024-12-23T20:00:00Z',
		state: 'Published',
		createdDate: '2024-08-01T09:00:00Z',
		images: ['/assets/item-images/bike.png'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439034',
		sharerId: '507f1f77bcf86cd799439014',
		title: 'Cordless Drill',
		description: 'Professional grade cordless drill with multiple attachments. Perfect for home improvement projects.',
		category: 'Tools & Equipment',
		location: 'Philadelphia, PA',
		sharingStart: '2024-08-11T08:00:00Z',
		sharingEnd: '2024-12-23T20:00:00Z',
		state: 'Active',
		createdDate: '2024-08-02T10:00:00Z',
		images: ['/assets/item-images/projector.png'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439035',
		sharerId: '507f1f77bcf86cd799439014',
		title: 'Hand Mixer',
		description: 'Electric hand mixer with multiple speed settings. Great for baking and cooking.',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingStart: '2024-08-11T08:00:00Z',
		sharingEnd: '2024-12-23T20:00:00Z',
		state: 'Published',
		createdDate: '2024-08-03T11:00:00Z',
		images: ['/assets/item-images/sewing-machine.png'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439036',
		sharerId: '507f1f77bcf86cd799439011', // Alice
		title: 'Winter Coat',
		description: 'Warm winter coat, size large. Great for cold weather.',
		category: 'Clothing',
		location: 'Chicago, IL',
		sharingStart: '2024-10-01T08:00:00Z',
		sharingEnd: '2025-03-31T20:00:00Z',
		state: 'Active',
		createdDate: '2024-09-15T12:00:00Z',
		images: ['/assets/item-images/backpack.png'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439037',
		sharerId: '507f1f77bcf86cd799439013', // Duy
		title: 'Gaming Console',
		description: 'PlayStation 5 with two controllers. Perfect for weekend gaming sessions.',
		category: 'Electronics',
		location: 'Philadelphia, PA',
		sharingStart: '2024-11-01T08:00:00Z',
		sharingEnd: '2025-01-31T20:00:00Z',
		state: 'Published',
		createdDate: '2024-10-25T14:00:00Z',
		images: ['/assets/item-images/projector.png'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439038',
		sharerId: '507f1f77bcf86cd799439013', // Duy
		title: 'Camping Tent',
		description: '4-person camping tent with rain fly. Great for family camping trips.',
		category: 'Sports',
		location: 'Philadelphia, PA',
		sharingStart: '2024-11-15T08:00:00Z',
		sharingEnd: '2025-02-15T20:00:00Z',
		state: 'Published',
		createdDate: '2024-11-01T09:00:00Z',
		images: ['/assets/item-images/tent.png'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439039',
		sharerId: '507f1f77bcf86cd799439013', // Duy
		title: 'Air Fryer',
		description: 'Digital air fryer with 8 preset cooking modes. Makes healthy cooking easy!',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingStart: '2024-11-20T08:00:00Z',
		sharingEnd: '2025-03-20T20:00:00Z',
		state: 'Active',
		createdDate: '2024-11-05T11:00:00Z',
		images: ['/assets/item-images/sewing-machine.png'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439040',
		sharerId: '807f1f77bcf86cd799439044', // admin
		title: 'Camping Tent. ADMIN',
		description: '4-person camping tent with rain fly. Great for family camping trips.',
		category: 'Sports',
		location: 'Philadelphia, PA',
		sharingStart: '2024-11-15T08:00:00Z',
		sharingEnd: '2025-02-15T20:00:00Z',
		state: 'Published',
		createdDate: '2024-11-01T09:00:00Z',
		images: ['/assets/item-images/tent.png'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439041',
		sharerId: '807f1f77bcf86cd799439044', // Admin
		title: 'Air Fryer ADMIN',
		description: 'Digital air fryer with 8 preset cooking modes. Makes healthy cooking easy!',
		category: 'Home & Garden',
		location: 'Philadelphia, PA',
		sharingStart: '2024-11-20T08:00:00Z',
		sharingEnd: '2025-03-20T20:00:00Z',
		state: 'Active',
		createdDate: '2024-11-05T11:00:00Z',
		images: ['/assets/item-images/sewing-machine.png'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439042',
		sharerId: '507f1f77bcf86cd799439011', // Alice
		title: 'Canon EOS R5 Camera',
		description: 'Professional mirrorless camera with 45MP full-frame sensor. Perfect for photography and videography.',
		category: 'Electronics',
		location: 'Springfield, IL',
		sharingStart: '2025-08-01T08:00:00Z',
		sharingEnd: '2025-09-30T20:00:00Z',
		state: 'Published',
		createdDate: '2025-07-15T09:00:00Z',
		images: ['https://i.ebayimg.com/images/g/VE0AAOSwzfphwzDY/s-l1600.jpg'],
	}),
	createItemListing({
		id: '707f1f77bcf86cd799439043',
		sharerId: '507f1f77bcf86cd799439012', // Bob
		title: 'Shure SM7B Microphone',
		description: 'Professional studio microphone, perfect for podcasting, streaming, and vocal recording.',
		category: 'Electronics',
		location: 'Springfield, IL',
		sharingStart: '2025-08-15T08:00:00Z',
		sharingEnd: '2025-09-15T20:00:00Z',
		state: 'Published',
		createdDate: '2025-08-01T10:00:00Z',
		images: ['https://traceaudio.com/cdn/shop/products/NewSM7BwithAnserModcopy_1200x1200.jpg?v=1662083374'],
	}),
] as unknown as Models.Listing.ItemListing[];
