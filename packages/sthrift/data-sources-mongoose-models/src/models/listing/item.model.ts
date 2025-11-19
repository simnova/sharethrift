import { Schema, type Model, type ObjectId, type PopulatedDoc } from 'mongoose';
import {
	type Listing,
	type ListingModelType,
	listingOptions,
} from './listing.model.ts';
import type * as User from '../user/user.model.ts';

export interface ItemListing extends Listing {
	sharer: PopulatedDoc<User.User> | ObjectId;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state?:
		| 'Published'
		| 'Paused'
		| 'Cancelled'
		| 'Drafted'
		| 'Expired'
		| 'Blocked'
		| 'Appeal Requested';
	createdAt: Date;
	updatedAt: Date;
	sharingHistory?: ObjectId[];
	reports?: number;
	images?: string[];
	listingType: string;
}

export const LISTING_STATE_ENUM = [
	'Active',
	'Published',
	'Paused',
	'Cancelled',
	'Drafted',
	'Expired',
	'Blocked',
	'Appeal Requested',
] as const;

export const ItemListingSchema = new Schema<
	ItemListing,
	Model<ItemListing>,
	ItemListing
>(
	{
		sharer: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: { type: String, required: false, maxlength: 200 },
		description: { type: String, required: false, maxlength: 2000 },
		category: { type: String, required: false, maxlength: 100 },
		location: { type: String, required: false, maxlength: 255 },
		sharingPeriodStart: { type: Date, required: false },
		sharingPeriodEnd: { type: Date, required: false },
		state: {
			type: String,
			enum: LISTING_STATE_ENUM,
			required: false,
		},
		sharingHistory: [{ type: String }],
		reports: { type: Number, default: 0 },
		images: [{ type: String }], // Array of image URLs
	},
	listingOptions,
);

export const ItemListingModelName: string = 'item-listing';

export const ItemListingModelFactory = (ListingModel: ListingModelType) => {
	return ListingModel.discriminator(ItemListingModelName, ItemListingSchema);
};

export type ItemListingModelType = ReturnType<typeof ItemListingModelFactory>;
