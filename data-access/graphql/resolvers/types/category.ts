import {MongoBase} from './interfaces/mongo-base';
export interface CategoryType extends MongoBase {
  name: string;
  parentId: CategoryType | string | null;
  childrenIds: (CategoryType | string | null)[];
}

export class Category implements CategoryType {
  id: string;
  schemaVersion: string;
  name: string;
  parentId: CategoryType | string | null;
  childrenIds: (CategoryType | string | null)[];
  createdAt: Date;
  updatedAt: Date;
}