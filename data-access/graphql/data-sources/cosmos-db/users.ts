import { MongoDataSource } from 'apollo-datasource-mongodb';
import { User } from '../../../infrastructure/data-sources/cosmos-db/models/user';
import { Context } from '../../context';

export class Users extends MongoDataSource<User, Context> {
  
  async getUser(userId : string): Promise<User> {
    return this.findOneById(userId);
  }

  async getByExternalId(externalId : string): Promise<User> {
    return (await this.findByFields({externalId: externalId}))[0];
  }

  async getUsers(): Promise<User[]> {
    console.log(`getUsers:context${JSON.stringify(this.context.VerifiedUser)}`);
    return this.model
      .find({})
      .exec();
  }
  
}