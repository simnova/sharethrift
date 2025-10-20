import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

export const itemListings = [
	{
		_id: '707f1f77bcf86cd799439031',
		sharer: new ObjectId('507f1f77bcf86cd799439011'), // Alice
		title: 'Lawn Mower',
		description: 'A reliable lawn mower for your yard.',
		category: 'Garden',
		location: 'Springfield, IL',
		sharingPeriodStart: new Date('2023-04-01T08:00:00Z'),
		sharingPeriodEnd: new Date('2023-04-30T20:00:00Z'),
		state: 'Published',
		createdAt: new Date('2023-03-25T09:00:00Z'),
		updatedAt: new Date('2023-03-25T09:00:00Z'),
		sharingHistory: [],
		reports: 0,
		images: ['https://picsum.photos/200/200?random=7'],
		schemaVersion: '1.0.0',
		version: 1,
		listingType: 'item-listing',
	},
	{
		_id: '707f1f77bcf86cd799439033',
		sharer: new ObjectId('507f1f77bcf86cd799439011'), // Alice
		title: 'Power Drill',
		description: 'Professional grade power drill with multiple bits.',
		category: 'Tools',
		location: 'Springfield, IL',
		sharingPeriodStart: new Date('2023-06-01T08:00:00Z'),
		sharingPeriodEnd: new Date('2023-06-30T20:00:00Z'),
		state: 'Blocked',
		createdAt: new Date('2023-05-15T14:00:00Z'),
		updatedAt: new Date('2023-05-20T16:00:00Z'),
		sharingHistory: [],
		reports: 3,
		images: ['https://picsum.photos/200/200?random=1'],
		schemaVersion: '1.0.0',
		version: 1,
		listingType: 'item-listing',
	},
] as unknown as Models.Listing.ItemListing[];
