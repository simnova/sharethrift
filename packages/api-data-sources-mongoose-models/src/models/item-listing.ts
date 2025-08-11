import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { modelFactory } from '@cellix/data-sources-mongoose';
import { Schema } from 'mongoose';

export interface ItemListingModel {
	_id: string;
	sharer: string;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state: string;
	updatedAt?: Date;
	createdAt?: Date;
	sharingHistory?: string[];
	reports?: number;
}

export const ItemListingSchema = new Schema<ItemListingModel>(
	{
		sharer: {
			type: String,
			required: true,
			index: true,
		},
		title: {
			type: String,
			required: true,
			maxlength: 200,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			maxlength: 2000,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			maxlength: 100,
			trim: true,
			index: true,
		},
		location: {
			type: String,
			required: true,
			maxlength: 255,
			trim: true,
			index: true,
		},
		sharingPeriodStart: {
			type: Date,
			required: true,
			index: true,
		},
		sharingPeriodEnd: {
			type: Date,
			required: true,
			index: true,
		},
		state: {
			type: String,
			required: true,
			enum: [
				'Published',
				'Paused',
				'Cancelled',
				'Drafted',
				'Expired',
				'Blocked',
				'Appeal Requested',
			],
			default: 'Drafted',
			index: true,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			immutable: true,
		},
		sharingHistory: [
			{
				type: String,
			},
		],
		reports: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
		collection: 'itemlistings',
	},
);

// Add text index for search functionality
ItemListingSchema.index(
	{
		title: 'text',
		description: 'text',
		category: 'text',
		location: 'text',
	},
	{
		weights: {
			title: 10,
			description: 5,
			category: 3,
			location: 2,
		},
	},
);

export const ItemListingModelFactory = modelFactory<ItemListingModel>(
	'ItemListing',
	ItemListingSchema,
);