import { Schema } from 'mongoose';
import type { Model, PopulatedDoc, ObjectId } from 'mongoose';
import { type Listing, type ListingModelType, listingOptions } from './listing.model.ts';
import * as PersonalUser from '../user/personal-user.model.ts'

export interface ItemListing extends Listing {
  sharer: PopulatedDoc<PersonalUser.PersonalUser> | ObjectId;
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: Date;
  sharingPeriodEnd: Date;
  state?: 'Published' | 'Paused' | 'Cancelled' | 'Drafted' | 'Expired' | 'Blocked' | 'Appeal Requested';
  createdAt: Date;
  updatedAt: Date;
  sharingHistory?: ObjectId[];
  reports?: number;
}

export const ItemListingSchema = new Schema<ItemListing, Model<ItemListing>, ItemListing>({
	sharer: { type: Schema.Types.ObjectId, ref: PersonalUser.PersonalUserModelName, required: true  },
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
	sharingHistory: [{ type: Schema.Types.ObjectId, ref: 'ItemListing' }],
	reports: { type: Number, default: 0 },
}, listingOptions);

export const ItemListingModelName: string = 'item-listing';

export const ItemListingModelFactory = (ListingModel: ListingModelType) => {
	return ListingModel.discriminator(ItemListingModelName, ItemListingSchema);
};

export type ItemListingModelType = ReturnType<typeof ItemListingModelFactory>;