import { Account as AccountDO} from "../../../domain/contexts/account/account";
import { AccountConverter, AccountDomainAdapter } from "../../../domain/infrastructure/persistance/adapters/account-domain-adapter";
import { MongoAccountRepository } from "../../../domain/infrastructure/persistance/repositories/mongo-account-repository";
import { Context } from '../../context';
import { AccountUpdateInput } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { Account } from '../../../infrastructure/data-sources/cosmos-db/models/account';

type PropType = AccountDomainAdapter;
type DomainType = AccountDO<PropType>;
type RepoType = MongoAccountRepository<PropType>;

export class Accounts extends DomainDataSource<Context, Account, PropType, DomainType, RepoType> {
  async updateAccount(account: AccountUpdateInput): Promise<Account> {
    if(this.context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized');
    }
    let result : Account;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(account.id);  
      domainObject.setHandle(account.handle);
      domainObject.setName(account.name);
      result = (new AccountConverter()).toMongo(await repo.save(domainObject));
    });
    return result;
  }
}