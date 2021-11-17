import mongoose, { Schema, model, Model, PopulatedDoc, ObjectId } from 'mongoose';
import { Base, EmbeddedBase, BaseOptions} from './interfaces/base';
import * as Category  from './category';
import * as Location from './location';
import * as Account from './account'

export interface Photo extends EmbeddedBase {
  order: number,
  documentId: string
}

interface ListingBase {
  title: string;
  description: string;
  primaryCategory?: PopulatedDoc<Category.Category> | ObjectId;
  photos?: mongoose.Types.DocumentArray<Photo>;
  location?: PopulatedDoc<Location.Location>;
  statusHistory: mongoose.Types.DocumentArray<ListingStatus>;
}

export interface Listing extends ListingBase, Base {
  account: Account.Account | ObjectId;
  draft: ListingDraft
}

export interface ListingStatus extends EmbeddedBase {
  statusCode: string;
  statusDetail: string;
}

export interface ListingDraft extends ListingBase, EmbeddedBase {
}

export const ListingModel = model<Listing>('Listing',new Schema<Listing, Model<Listing>, Listing>(
  {
    schemaVersion: {
      type: String,
      default: '1.0.0',
    },
    draft: {
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
      statusHistory: [{
        statusCode: {
          type: String,
          enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'],
          default: 'DRAFT',
          required: true},
        statusDetail: {
          type: String,
          required: false},
        createdAt: {
          type: Date,
          default: Date.now
        }
      }],
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: Account.AccountModel.modelName,
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
    ...BaseOptions,
  }
));