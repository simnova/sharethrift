import { Schema, model, Model, PopulatedDoc, Document } from 'mongoose';
import { Base } from './base';

export const ModelName = 'Category';

export interface Category extends Base {
  name: string;
  path: string;
  parentId: Category;
  childrenIds: Category[];
};

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
    path: {
      type: String,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    childrenIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }]
  },
  {
    timestamps: true, 
    versionKey: 'version',    
  }
));

export type CategoryModelType = typeof CategoryModel;