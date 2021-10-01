export class Category implements CategoryDetails{
  name: string;
  path: string;
  parentId: Category;
  childrenIds: Category[];
  id: string;
  schemaVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryDetails {
  readonly name: string;
  readonly path: string;
  readonly parentId: CategoryDetails;
  readonly childrenIds: CategoryDetails[];
}