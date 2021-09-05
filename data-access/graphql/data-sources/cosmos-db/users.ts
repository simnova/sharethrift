import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as User from '../../../shared/data-sources/cosmos-db/models/user';
import Context from '../../context';

export default class Users extends MongoDataSource<User.User, Context> {
  getUser(userId : string): Promise<User.User> {
    return this.findOneById(userId)
  }
  updateUserName(userId, newName) {
    

    this.deleteFromCacheById(userId)
    return this.collection.updateOne({
      _id: userId
    }, {
      $set: { name: newName }
    })
  }
  
}