import { ObjectId } from 'mongoose';
import {MongoBase} from './interfaces/mongo-base';
export interface CategoryType extends MongoBase {
  name: string;
  parentId: CategoryType | ObjectId ;
  childrenIds: (CategoryType | ObjectId)[];
}

export class Category implements CategoryType{
  name: string;
  parentId: CategoryType | ObjectId ;
  childrenIds: (CategoryType | ObjectId )[];

  id: string;
  schemaVersion: string;
  createdAt: Date;
  updatedAt: Date;
}