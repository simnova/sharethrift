
import { type Model, Schema, Types } from 'mongoose';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';

// Local interface for Mongoose schema typing (plain data shape, not domain aggregate)
export interface Listing extends MongooseSeedwork.Base {
	discriminatorKey: string;
	// All required fields from Base
	id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
	_id: Types.ObjectId;
	schemaVersion: string;
	version: number;
}

export const listingOptions = {
	discriminatorKey: 'listingType',
	timestamps: true,
};

const ListingSchema = new Schema<Listing, Model<Listing>, Listing>({}, listingOptions);
export const ListingModelName = 'Listing';

export const ListingModelFactory = MongooseSeedwork.modelFactory<Listing>(
	ListingModelName,
	ListingSchema,
);

export type ListingModelType = ReturnType<typeof ListingModelFactory>;