
import { Schema, type Document, type Types } from 'mongoose';

export interface ItemListingModel extends Document {
	id: Types.ObjectId;
	sharer: string;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state: string;
	sharingHistory?: string[];
	reports?: number;
	createdAt: Date;
	updatedAt: Date;
	version: number;
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