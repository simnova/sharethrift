import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Account } from '../../../infrastructure/data-sources/cosmos-db/models/account';
import { Context } from '../../context';

export class Accounts extends MongoDataSource<Account, Context> {
  
  async getAccount(accountId : string): Promise<Account> {
    return this.findOneById(accountId);
  }

  async getAccounts(): Promise<Account[]> {
    var userExternalId = this.context.VerifiedUser.VerifiedJWT.sub;
    var user = await this.context.dataSources.userAPI.getByExternalId(userExternalId);
    return this.model.find({'contacts.user': user._id}).exec(); //findByFields does not support deep queries
  }

  async getAllAccounts(): Promise<Account[]> {
    return this.findByFields({});
  }
  
}