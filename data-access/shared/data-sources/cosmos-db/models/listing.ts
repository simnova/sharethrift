import { Schema, model, Model, PopulatedDoc } from 'mongoose';
import * as Category  from './category';
import * as Location from './location';
import * as User from './user';

export interface ListingType {
  _id: string;
  schemaVersion: string;
  owner: User.UserType;
  title: string;
  description: string;
  primaryCategory: PopulatedDoc<Category.CategoryType>;
  photos: [
    _id: string,
    order: number,
    documentId: string
  ];
  location: PopulatedDoc<Location.LocationType>;
  updatedAt: Date;
  createdAt: Date;
}

export const ListingModel = model<ListingType>('Listing',new Schema<ListingType, Model<ListingType>, ListingType>(
  {
    schemaVersion: {
      type: String,
      default: '1.0.0',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: User.UserModel.modelName,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    primaryCategory: {
      type: Schema.Types.ObjectId,
      ref: Category.CategoryModel.modelName,
      required: false,
      index: true,
    },
    photos: [{
      _id: true,
      order: {
        type: Number,
        required: true,
      },
      documentId: {
        type: String,
        required: true
      }
    }],
    location: Location.LocationModel.schema,
  },
  {
    timestamps: true, 
    versionKey: true, 
    collection: 'listings',
  }
));