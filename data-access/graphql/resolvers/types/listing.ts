import * as User from './User';
import * as Category from './Category';
import * as Location from './Location';

export interface ListingType {
  _id: string;
  schemaVersion: string;
  owner: User.UserType;
  title: string;
  description: string;
  primaryCategory: Category.CategoryType;
  photos: [
    _id: string,
    order: number,
    documentId: string
  ];
  location: Location.LocationType;
  updatedAt: Date;
  createdAt: Date;
}
