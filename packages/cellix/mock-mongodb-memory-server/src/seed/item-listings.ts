import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

type PlainItemListing = Omit<
	Models.Listing.ItemListing,
	keyof import('mongoose').Document
> & { _id: string };

export const itemListings: PlainItemListing[] = [
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
		images: ['lawnmower.jpg'],
		schemaVersion: '1.0.0',
		version: 1,
		discriminatorKey: 'item-listing',
	},
	{
		_id: '707f1f77bcf86cd799439032',
		sharer: new ObjectId('507f1f77bcf86cd799439012'), // Bob
		title: 'Mountain Bike',
		description: 'A sturdy mountain bike for off-road adventures.',
		category: 'Sports',
		location: 'Springfield, IL',
		sharingPeriodStart: new Date('2023-05-01T08:00:00Z'),
		sharingPeriodEnd: new Date('2023-05-31T20:00:00Z'),
		state: 'Published',
		createdAt: new Date('2023-04-20T10:00:00Z'),
		updatedAt: new Date('2023-04-20T10:00:00Z'),
		sharingHistory: [],
		reports: 0,
		images: ['mountainbike.jpg'],
		schemaVersion: '1.0.0',
		version: 1,
		discriminatorKey: 'item-listing',
	},
];
