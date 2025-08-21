import { Schema, type Model, Types } from 'mongoose';
import { type Listing, type ListingModelType, listingOptions } from './listing.model.ts';

// Local interface for Mongoose schema typing (plain data shape, not domain aggregate)
export interface ItemListing extends Listing {
	sharer: string;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state?: 'Published' | 'Paused' | 'Cancelled' | 'Drafted' | 'Expired' | 'Blocked' | 'Appeal Requested';
	createdAt: Date;
	updatedAt: Date;
	sharingHistory?: string[];
	reports?: number;
	_id: Types.ObjectId;
}

export const ItemListingSchema = new Schema<ItemListing, Model<ItemListing>, ItemListing>({
	sharer: { type: String, required: true },
	title: { type: String, required: true, maxlength: 200 },
	description: { type: String, required: true, maxlength: 2000 },
	category: { type: String, required: true, maxlength: 100 },
	location: { type: String, required: true, maxlength: 255 },
	sharingPeriodStart: { type: Date, required: true },
	sharingPeriodEnd: { type: Date, required: true },
	state: {
		type: String,
		enum: ['Published', 'Paused', 'Cancelled', 'Drafted', 'Expired', 'Blocked', 'Appeal Requested'],
		required: false
	},
	createdAt: { type: Date, required: false, default: Date.now },
	updatedAt: { type: Date, required: false, default: Date.now },
	sharingHistory: [{ type: String }],
	reports: { type: Number, default: 0 },
}, listingOptions);

export const ItemListingModelName: string = 'item-listing';

export const ItemListingModelFactory = (ListingModel: ListingModelType) => {
	return ListingModel.discriminator(ItemListingModelName, ItemListingSchema);
};

export type ItemListingModelType = ReturnType<typeof ItemListingModelFactory>;