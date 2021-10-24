import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as Account from '../../../infrastructure/data-sources/cosmos-db/models/account';
import {Context} from '../../context';
import { AccountDomainAdapter } from '../../../domain/infrastructure/persistance/adapters/account-domain-adapter';
import { AccountEntityReference } from '../../../domain/contexts/account/account';

export default class Accounts extends MongoDataSource<Account.Account, Context> {
  
  async getAccount(accountId : string): Promise<AccountEntityReference> {
    return new AccountDomainAdapter(await this.findOneById(accountId));
  }

  async getAccounts(): Promise<AccountEntityReference[]> {
    return (await this.model
      .find({})
      .exec())
      .map((account: Account.Account) => new AccountDomainAdapter(account));
  }
  
}