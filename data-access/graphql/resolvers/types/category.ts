export interface CategoryType {
  _id: string;
  schemaVersion: string;
  name: string;
  parentId: CategoryType | string | null;
  childrenIds: (CategoryType | string | null)[];
  createdAt: Date;
  updatedAt: Date;
}

export class Category implements CategoryType {
  _id: string;
  schemaVersion: string;
  name: string;
  parentId: CategoryType | string | null;
  childrenIds: (CategoryType | string | null)[];
  createdAt: Date;
  updatedAt: Date;
}