import { Schema, model, Model, PopulatedDoc } from 'mongoose';

export const ModelName = 'Category';

export interface Category {
  _id: string;
  schemaVersion: string;
  name: string;
  parentId: PopulatedDoc<Category>;
  childrenIds: PopulatedDoc<Category>[];
  path:string;
  createdAt: Date;
  updatedAt: Date;
}

export const CategoryModel = model<Category>(ModelName,new Schema<Category, Model<Category>, Category>(
  {
    schemaVersion: {
      type: String,
      default: '1.0.0',
    },
    name: {
      type: String,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: ModelName,
      required: false,
    },
    childrenIds: [{
      type: Schema.Types.ObjectId,
      ref: ModelName,
      required: false,
      index: true,
    }],
    path: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true, 
    versionKey: true, 
    collection: 'categories',
  }
));