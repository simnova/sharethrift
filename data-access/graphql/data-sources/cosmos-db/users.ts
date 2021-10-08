import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as User from '../../../infrastructure/data-sources/cosmos-db/models/user';
import {Context} from '../../context';
import { UserDomainAdapter } from '../../../domain/infrastructure/persistance/adapters/user-domain-adapter';
import { UserEntityReference } from '../../../domain/contexts/user';

export default class Users extends MongoDataSource<User.User, Context> {
  
  async getUser(userId : string): Promise<UserEntityReference> {
    return new UserDomainAdapter(await this.findOneById(userId));
  }

  async getUsers(): Promise<UserEntityReference[]> {
    return (await this.model
      .find({})
      .exec())
      .map((user: User.User) => new UserDomainAdapter(user));
  }
/*
  async createUser(firstName: string, lastName: string, email:string): Promise<User.User> {
    return this.model.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
    });
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
  */
}