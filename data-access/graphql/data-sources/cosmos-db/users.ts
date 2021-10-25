import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as User from '../../../infrastructure/data-sources/cosmos-db/models/user';
import {Context} from '../../context';
import { UserDomainAdapter } from '../../../domain/infrastructure/persistance/adapters/user-domain-adapter';
import { UserEntityReference } from '../../../domain/contexts/user/user';

export default class Users extends MongoDataSource<User.User, Context> {
  
  async getUser(userId : string): Promise<UserEntityReference> {
    return new UserDomainAdapter(await this.findOneById(userId));
  }

  async getUsers(): Promise<UserEntityReference[]> {
    console.log(`getUsers:jwt:userid${JSON.stringify(this.context.VerifedUser.VerifiedJWT.sub)}`);
    return (await this.model
      .find({})
      .exec())
      .map((user: User.User) => new UserDomainAdapter(user));
  }
  
}