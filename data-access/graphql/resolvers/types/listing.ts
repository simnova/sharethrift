import * as User from './User';
import * as Category from './Category';
import * as Location from './Location';
import {MongoBase} from './interfaces/mongo-base';
import { ObjectId } from 'mongoose';

export interface ListingType extends MongoBase{
  owner: User.UserType | ObjectId;
  title: string;
  description: string;
  primaryCategory: Category.CategoryType | ObjectId;
  photos: [
    id: string,
    order: number,
    documentId: string
  ];
  location: Location.LocationType;
}
