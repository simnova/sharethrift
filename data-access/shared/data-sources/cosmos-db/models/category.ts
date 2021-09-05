import { Schema, model, Model, PopulatedDoc } from 'mongoose';

export const ModelName = 'Category';

export interface CategoryType {
  _id: string;
  schemaVersion: string;
  name: string;
  parentId: PopulatedDoc<CategoryType>;
  childrenIds: PopulatedDoc<CategoryType>[];
  path:string;
  createdAt: Date;
  updatedAt: Date;
}

export const CategoryModel = model<CategoryType>(ModelName,new Schema<CategoryType, Model<CategoryType>, CategoryType>(
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