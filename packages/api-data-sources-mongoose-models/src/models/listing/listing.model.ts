import { type Model, Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';

export interface Listing extends MongooseSeedwork.Base {
	discriminatorKey: string;
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