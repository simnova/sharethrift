import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

interface ListingData {
	id: string;
	sharerId: string;
	title: string;
	description: string;
	category: string;
	location: string;
	start: string;
	end: string;
	state: string;
	created: string;
	updated: string;
	images: string[];
}

const LISTING_DATA: ListingData[] = [
	{ id: '707f1f77bcf86cd799439031', sharerId: '507f1f77bcf86cd799439011', title: 'Lawn Mower', description: 'A reliable lawn mower for your yard.', category: 'Garden', location: 'Springfield, IL', start: '2023-04-01T08:00:00Z', end: '2023-04-30T20:00:00Z', state: 'Published', created: '2023-03-25T09:00:00Z', updated: '2023-03-25T09:00:00Z', images: ['lawnmower.jpg'] },
	{ id: '707f1f77bcf86cd799439032', sharerId: '507f1f77bcf86cd799439012', title: 'Mountain Bike', description: 'A sturdy mountain bike for off-road adventures.', category: 'Sports', location: 'Springfield, IL', start: '2023-05-01T08:00:00Z', end: '2023-05-31T20:00:00Z', state: 'Published', created: '2023-04-20T10:00:00Z', updated: '2023-04-20T10:00:00Z', images: ['mountainbike.jpg'] },
	{ id: '707f1f77bcf86cd799439033', sharerId: '507f1f77bcf86cd799439011', title: 'City Bike', description: 'Perfect city bike for commuting and leisure rides around the neighborhood.', category: 'Vehicles', location: 'Philadelphia, PA', start: '2024-08-11T08:00:00Z', end: '2024-12-23T20:00:00Z', state: 'Published', created: '2024-08-01T09:00:00Z', updated: '2024-08-01T09:00:00Z', images: ['/assets/item-images/bike.png'] },
	{ id: '707f1f77bcf86cd799439034', sharerId: '507f1f77bcf86cd799439014', title: 'Cordless Drill', description: 'Professional grade cordless drill with multiple attachments. Perfect for home improvement projects.', category: 'Tools & Equipment', location: 'Philadelphia, PA', start: '2024-08-11T08:00:00Z', end: '2024-12-23T20:00:00Z', state: 'Active', created: '2024-08-02T10:00:00Z', updated: '2024-08-02T10:00:00Z', images: ['/assets/item-images/projector.png'] },
	{ id: '707f1f77bcf86cd799439035', sharerId: '507f1f77bcf86cd799439014', title: 'Hand Mixer', description: 'Electric hand mixer with multiple speed settings. Great for baking and cooking.', category: 'Home & Garden', location: 'Philadelphia, PA', start: '2024-08-11T08:00:00Z', end: '2024-12-23T20:00:00Z', state: 'Published', created: '2024-08-03T11:00:00Z', updated: '2024-08-03T11:00:00Z', images: ['/assets/item-images/sewing-machine.png'] },
	{ id: '707f1f77bcf86cd799439036', sharerId: '507f1f77bcf86cd799439011', title: 'Winter Coat', description: 'Warm winter coat, size large. Great for cold weather.', category: 'Clothing', location: 'Chicago, IL', start: '2024-10-01T08:00:00Z', end: '2025-03-31T20:00:00Z', state: 'Active', created: '2024-09-15T12:00:00Z', updated: '2024-09-15T12:00:00Z', images: [] },
	{ id: '707f1f77bcf86cd799439037', sharerId: '507f1f77bcf86cd799439012', title: 'Camping Tent - 4 Person', description: 'Spacious 4-person camping tent with waterproof design. Perfect for weekend adventures and family camping trips.', category: 'Outdoor & Recreation', location: 'Philadelphia, PA', start: '2024-11-01T08:00:00Z', end: '2025-09-30T20:00:00Z', state: 'Published', created: '2024-10-20T10:00:00Z', updated: '2024-10-20T10:00:00Z', images: ['/assets/item-images/tent.png'] },
	{ id: '707f1f77bcf86cd799439038', sharerId: '507f1f77bcf86cd799439013', title: 'Professional Camera Kit', description: 'Canon DSLR camera with multiple lenses and accessories. Great for photography enthusiasts and events.', category: 'Electronics', location: 'Philadelphia, PA', start: '2024-11-01T08:00:00Z', end: '2025-06-30T20:00:00Z', state: 'Published', created: '2024-10-25T14:00:00Z', updated: '2024-10-25T14:00:00Z', images: ['/assets/item-images/camera.png'] },
	{ id: '707f1f77bcf86cd799439039', sharerId: '507f1f77bcf86cd799439011', title: 'Canon EOS R5 Camera', description: 'Professional mirrorless camera with 45MP full-frame sensor. Perfect for photography and videography.', category: 'Electronics', location: 'Springfield, IL', start: '2025-08-01T08:00:00Z', end: '2025-09-30T20:00:00Z', state: 'Published', created: '2025-07-15T09:00:00Z', updated: '2025-07-15T09:00:00Z', images: ['https://i.ebayimg.com/images/g/VE0AAOSwzfphwzDY/s-l1600.jpg'] },
	{ id: '707f1f77bcf86cd799439040', sharerId: '507f1f77bcf86cd799439012', title: 'Shure SM7B Microphone', description: 'Professional studio microphone, perfect for podcasting, streaming, and vocal recording.', category: 'Electronics', location: 'Springfield, IL', start: '2025-08-15T08:00:00Z', end: '2025-09-15T20:00:00Z', state: 'Published', created: '2025-08-01T10:00:00Z', updated: '2025-08-01T10:00:00Z', images: ['https://traceaudio.com/cdn/shop/products/NewSM7BwithAnserModcopy_1200x1200.jpg?v=1662083374'] },
];

export const itemListings = LISTING_DATA.map(listing => ({
	_id: new ObjectId(listing.id),
	sharer: new ObjectId(listing.sharerId),
	title: listing.title,
	description: listing.description,
	category: listing.category,
	location: listing.location,
	sharingPeriodStart: new Date(listing.start),
	sharingPeriodEnd: new Date(listing.end),
	state: listing.state,
	createdAt: new Date(listing.created),
	updatedAt: new Date(listing.updated),
	images: listing.images,
	sharingHistory: [],
	reports: 0,
	schemaVersion: '1.0.0',
	version: 1,
	listingType: 'item-listing' as const,
})) as unknown as Models.Listing.ItemListing[];
