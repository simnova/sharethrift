import { ObjectId } from 'mongoose';
import {MongoBase} from './interfaces/mongo-base';
export interface CategoryType extends MongoBase {
  name: string;
  parentId: CategoryType | ObjectId | null;
  childrenIds: (CategoryType | ObjectId | null)[];
}

export class Category implements CategoryType{
  name: string;
  parentId: CategoryType | ObjectId | null;
  childrenIds: (CategoryType | ObjectId | null)[];

  id: string;
  schemaVersion: string;
  createdAt: Date;
  updatedAt: Date;
}