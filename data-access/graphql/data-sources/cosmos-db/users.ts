import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as User from '../../../shared/data-sources/cosmos-db/models/user';
import {Context} from '../../context';

export default class Users extends MongoDataSource<User.User, Context> {
  
  async getUser(userId : string): Promise<User.User> {
    return await this.findOneById(userId);
  }

  async getUsers(): Promise<User.User[]> {
    return this.model
      .find({})
      .exec();
  }

  async createUser(firstName: string, lastName: string, email:string): Promise<User.User> {
    var user = new User.UserModel({
      firstName: firstName,
      lastName: lastName,
      email: email
    });
    return await user.save();
  }

  async updateUser(userId:string, firstName: string, lastName: string, email:string): Promise<User.User> {
    this.deleteFromCacheById(userId)
    return this.model
      .updateOne({
        _id: userId
      }, {
        $set: { 
          firstName: firstName,
          lastName: lastName,
          email: email
        }
      })
      .exec()
      .then(
        () => this.findOneById(userId)
      );
  }
  
}