class CategoryDetail {
  name: string;
  path: string;
  parentId: CategoryDetail | string | null;
  childrenIds: (CategoryDetail | string | null)[];
}