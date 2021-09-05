import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as User from '../../../shared/data-sources/cosmos-db/models/user';
import {Context} from '../../context';

export default class Users extends MongoDataSource<User.UserType, Context> {
  getUser(userId : string): Promise<User.UserType> {
    return this.findOneById(userId)
  }

  updateUser(userId:string, firstName: string, lastName: string, email:string): Promise<User.UserType> {
    this.deleteFromCacheById(userId)
    return this.collection.updateOne({
      _id: userId
    }, {
      $set: { 
        firstName: firstName,
        lastName: lastName,
        email: email
      }
    }).then(() => this.findOneById(userId))
  }
  
}