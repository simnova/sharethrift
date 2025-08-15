import mongoose, { Schema, type Model, type Document, type ObjectId } from 'mongoose';
export interface ItemListingDocument extends Document {
  sharer: ObjectId;
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: Date;
  sharingPeriodEnd: Date;
  state?: 'Published' | 'Paused' | 'Cancelled' | 'Drafted' | 'Expired' | 'Blocked' | 'Appeal Requested';
  createdAt?: Date;
  updatedAt?: Date;
  sharingHistory?: ObjectId[];
  reports?: number;
}

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
		required: false
	},
	createdAt: { type: Date, required: false, default: Date.now },
	updatedAt: { type: Date, required: false, default: Date.now },
	sharingHistory: [{ type: Schema.Types.ObjectId, ref: 'ReservationRequest' }],
	reports: { type: Number, default: 0 },
});

export const ItemListingModelName = 'ItemListing';

let ItemListingModel: Model<ItemListingDocument>;
try {
  ItemListingModel = mongoose.model<ItemListingDocument>(ItemListingModelName);
} catch {
  ItemListingModel = mongoose.model<ItemListingDocument>(ItemListingModelName, ItemListingSchema);
}

export { ItemListingModel };
export const ItemListingCollectionName = 'Listings';