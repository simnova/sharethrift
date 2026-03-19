import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

const COMMON_LOCATIONS = {
	springfield: 'Springfield, IL',
	philadelphia: 'Philadelphia, PA',
	chicago: 'Chicago, IL',
} as const;

const COMMON_USERS = {
	alice: new ObjectId('507f1f77bcf86cd799439011'),
	bob: new ObjectId('507f1f77bcf86cd799439012'),
	charlie: new ObjectId('507f1f77bcf86cd799439013'),
	diana: new ObjectId('507f1f77bcf86cd799439014'),
} as const;

const COMMON_DATES = {
	Apr2023Start: new Date('2023-04-01T08:00:00Z'),
	Apr2023End: new Date('2023-04-30T20:00:00Z'),
	May2023Start: new Date('2023-05-01T08:00:00Z'),
	May2023End: new Date('2023-05-31T20:00:00Z'),
	Aug2024Start: new Date('2024-08-11T08:00:00Z'),
	Oct2024Start: new Date('2024-10-01T08:00:00Z'),
	Nov2024Start: new Date('2024-11-01T08:00:00Z'),
	Dec2024End: new Date('2024-12-23T20:00:00Z'),
	Mar2025End: new Date('2025-03-31T20:00:00Z'),
	Jun2025Mid: new Date('2025-06-30T20:00:00Z'),
	Aug2025Start: new Date('2025-08-01T08:00:00Z'),
	Aug2025Mid: new Date('2025-08-15T08:00:00Z'),
	Sep2025Mid: new Date('2025-09-15T20:00:00Z'),
	Sep2025End: new Date('2025-09-30T20:00:00Z'),
} as const;

const COMMON_METADATA = {
	schemaVersion: '1.0.0',
	version: 1,
	listingType: 'item-listing',
	sharingHistory: [],
	reports: 0,
} as const;

type ListingBase = {
	_id: string | ObjectId;
	sharer: ObjectId;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state: string;
	createdAt: Date;
	updatedAt: Date;
	images: string[];
};

const createListing = (props: ListingBase): Models.Listing.ItemListing =>
	({
		...COMMON_METADATA,
		...props,
	}) as unknown as Models.Listing.ItemListing;

export const itemListings = [
	createListing({
		_id: new ObjectId('707f1f77bcf86cd799439031'),
		sharer: COMMON_USERS.alice,
		title: 'Lawn Mower',
		description: 'A reliable lawn mower for your yard.',
		category: 'Garden',
		location: COMMON_LOCATIONS.springfield,
		sharingPeriodStart: COMMON_DATES.Apr2023Start,
		sharingPeriodEnd: COMMON_DATES.Apr2023End,
		state: 'Active',
		createdAt: new Date('2023-03-25T09:00:00Z'),
		updatedAt: new Date('2023-03-25T09:00:00Z'),
		images: ['lawnmower.jpg'],
	}),
	createListing({
		_id: new ObjectId('707f1f77bcf86cd799439032'),
		sharer: COMMON_USERS.bob,
		title: 'Mountain Bike',
		description: 'A sturdy mountain bike for off-road adventures.',
		category: 'Sports',
		location: COMMON_LOCATIONS.springfield,
		sharingPeriodStart: COMMON_DATES.May2023Start,
		sharingPeriodEnd: COMMON_DATES.May2023End,
		state: 'Active',
		createdAt: new Date('2023-04-20T10:00:00Z'),
		updatedAt: new Date('2023-04-20T10:00:00Z'),
		images: ['mountainbike.jpg'],
	}),
	createListing({
		_id: '707f1f77bcf86cd799439033',
		sharer: COMMON_USERS.alice,
		title: 'City Bike',
		description:
			'Perfect city bike for commuting and leisure rides around the neighborhood.',
		category: 'Vehicles',
		location: COMMON_LOCATIONS.philadelphia,
		sharingPeriodStart: COMMON_DATES.Aug2024Start,
		sharingPeriodEnd: COMMON_DATES.Dec2024End,
		state: 'Active',
		createdAt: new Date('2024-08-01T09:00:00Z'),
		updatedAt: new Date('2024-08-01T09:00:00Z'),
		images: ['/assets/item-images/bike.png'],
	}),
	createListing({
		_id: '707f1f77bcf86cd799439034',
		sharer: COMMON_USERS.diana,
		title: 'Cordless Drill',
		description:
			'Professional grade cordless drill with multiple attachments. Perfect for home improvement projects.',
		category: 'Tools & Equipment',
		location: 'Philadelphia, PA',
		sharingPeriodStart: new Date('2024-08-11T08:00:00Z'),
		sharingPeriodEnd: new Date('2024-12-23T20:00:00Z'),
		state: 'Active',
		createdAt: new Date('2024-08-02T10:00:00Z'),
		updatedAt: new Date('2024-08-02T10:00:00Z'),
		images: ['/assets/item-images/projector.png'],
	}),
	createListing({
		_id: '707f1f77bcf86cd799439035',
		sharer: COMMON_USERS.diana,
		title: 'Hand Mixer',
		description:
			'Electric hand mixer with multiple speed settings. Great for baking and cooking.',
		category: 'Home & Garden',
		location: COMMON_LOCATIONS.philadelphia,
		sharingPeriodStart: COMMON_DATES.Aug2024Start,
		sharingPeriodEnd: COMMON_DATES.Dec2024End,
		state: 'Active',
		createdAt: new Date('2024-08-03T11:00:00Z'),
		updatedAt: new Date('2024-08-03T11:00:00Z'),
		images: ['/assets/item-images/sewing-machine.png'],
	}),
	createListing({
		_id: '707f1f77bcf86cd799439036',
		sharer: COMMON_USERS.alice,
		title: 'Winter Coat',
		description: 'Warm winter coat, size large. Great for cold weather.',
		category: 'Clothing',
		location: 'Chicago, IL',
		sharingPeriodStart: new Date('2024-10-01T08:00:00Z'),
		sharingPeriodEnd: new Date('2025-03-31T20:00:00Z'),
		state: 'Active',
		createdAt: new Date('2024-09-15T12:00:00Z'),
		updatedAt: new Date('2024-09-15T12:00:00Z'),
		images: [],
	}),
	createListing({
		_id: '707f1f77bcf86cd799439037',
		sharer: COMMON_USERS.bob,
		title: 'Camping Tent - 4 Person',
		description:
			'Spacious 4-person camping tent with waterproof design. Perfect for weekend adventures and family camping trips.',
		category: 'Outdoor & Recreation',
		location: COMMON_LOCATIONS.philadelphia,
		sharingPeriodStart: COMMON_DATES.Nov2024Start,
		sharingPeriodEnd: COMMON_DATES.Sep2025End,
		state: 'Active',
		createdAt: new Date('2024-10-20T10:00:00Z'),
		updatedAt: new Date('2024-10-20T10:00:00Z'),
		images: ['/assets/item-images/tent.png'],
	}),
	createListing({
		_id: '707f1f77bcf86cd799439038',
		sharer: COMMON_USERS.charlie,
		title: 'Professional Camera Kit',
		description:
			'Canon DSLR camera with multiple lenses and accessories. Great for photography enthusiasts and events.',
		category: 'Electronics',
		location: COMMON_LOCATIONS.philadelphia,
		sharingPeriodStart: COMMON_DATES.Nov2024Start,
		sharingPeriodEnd: COMMON_DATES.Jun2025Mid,
		state: 'Active',
		createdAt: new Date('2024-10-25T14:00:00Z'),
		updatedAt: new Date('2024-10-25T14:00:00Z'),
		images: ['/assets/item-images/camera.png'],
	}),
	createListing({
		_id: '707f1f77bcf86cd799439039',
		sharer: COMMON_USERS.alice,
		title: 'Canon EOS R5 Camera',
		description:
			'Professional mirrorless camera with 45MP full-frame sensor. Perfect for photography and videography.',
		category: 'Electronics',
		location: COMMON_LOCATIONS.springfield,
		sharingPeriodStart: COMMON_DATES.Aug2025Start,
		sharingPeriodEnd: COMMON_DATES.Sep2025End,
		state: 'Active',
		createdAt: new Date('2025-07-15T09:00:00Z'),
		updatedAt: new Date('2025-07-15T09:00:00Z'),
		images: ['https://i.ebayimg.com/images/g/VE0AAOSwzfphwzDY/s-l1600.jpg'],
	}),
	createListing({
		_id: '707f1f77bcf86cd799439040',
		sharer: COMMON_USERS.bob,
		title: 'Shure SM7B Microphone',
		description:
			'Professional studio microphone, perfect for podcasting, streaming, and vocal recording.',
		category: 'Electronics',
		location: COMMON_LOCATIONS.springfield,
		sharingPeriodStart: COMMON_DATES.Aug2025Mid,
		sharingPeriodEnd: COMMON_DATES.Sep2025Mid,
		state: 'Active',
		createdAt: new Date('2025-08-01T10:00:00Z'),
		updatedAt: new Date('2025-08-01T10:00:00Z'),
		images: [
			'https://traceaudio.com/cdn/shop/products/NewSM7BwithAnserModcopy_1200x1200.jpg?v=1662083374',
		],
	}),
];
