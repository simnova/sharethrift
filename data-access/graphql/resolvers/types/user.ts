import {MongoBase} from './interfaces/mongo-base';

export interface UserType extends MongoBase {
  firstName: string;
  lastName: string;
  email: string;
}