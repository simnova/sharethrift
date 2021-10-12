import * as User from './user';
import * as Category from './category';
import * as Location from './location';
import {MongoBase} from './interfaces/mongo-base';
import { ObjectId } from 'mongoose';

export interface ListingType extends MongoBase{
  owner: User.UserType | ObjectId;
  title: string;
  description: string;
  primaryCategory: Category.CategoryType | ObjectId;
  photos: 
    {id: string,
    order: number,
    documentId: string}[]
  ;
  location: Location.LocationType;
}
