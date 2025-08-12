import { Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';

export const ItemListingSchema = new Schema({
	sharer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true, maxlength: 200 },
	description: { type: String, required: true, maxlength: 2000 },
	category: { type: String, required: true, maxlength: 100 },
	location: { type: String, required: true, maxlength: 255 },
	sharingPeriodStart: { type: Date, required: true },
	sharingPeriodEnd: { type: Date, required: true },
	state: {
		type: String,
		enum: ['Published', 'Paused', 'Cancelled', 'Drafted', 'Expired', 'Blocked', 'Appeal Requested'],
		required: true,
		default: 'Published'
	},
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now },
	schemaversion: { type: Number, required: true, default: 1 },
	sharingHistory: [{ type: Schema.Types.ObjectId, ref: 'ReservationRequest' }],
	reports: { type: Number, default: 0 },
	images: [{ type: String }] // Array of image URLs
}, { collection: 'item_listings' });

export const createItemListingModel = MongooseSeedwork.modelFactory(
	'ItemListing',
	ItemListingSchema,
);