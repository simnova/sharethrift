import { Account as AccountDO} from "../../../domain/contexts/account/account";
import { AccountConverter, AccountDomainAdapter } from "../../../domain/infrastructure/persistance/adapters/account-domain-adapter";
import { MongoAccountRepository } from "../../../domain/infrastructure/persistance/repositories/mongo-account-repository";
import { Context } from '../../context';
import { AccountUpdateInput, RoleAddInput, RoleUpdateInput } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { Account } from '../../../infrastructure/data-sources/cosmos-db/models/account';
import { getPassport, ensureAccountPortalUser } from './domain-data-utils';

type PropType = AccountDomainAdapter;
type DomainType = AccountDO<PropType>;
type RepoType = MongoAccountRepository<PropType>;

export class Accounts extends DomainDataSource<Context, Account, PropType, DomainType, RepoType> {

  async updateAccount(account: AccountUpdateInput): Promise<Account> {
    try {
      ensureAccountPortalUser(this.context);
      let result : Account;
      await this.withTransaction(async (repo) => {
        let domainObject = await repo.get(account.id);  
        await domainObject.setHandle(account.handle);
        await domainObject.setName(account.name);
        result = (new AccountConverter()).toMongo(await repo.save(domainObject));
      });
      return result;
    } catch (e) {
      console.error("data-sources/domina/accounts.ts:updateAccount:", e); 
      throw e;
    }
  }

  async accountUpdateRole(roleInput: RoleUpdateInput): Promise<Account> {
    ensureAccountPortalUser(this.context);
    let result : Account;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.getByHandle(roleInput.accountHandle); 
      const role = domainObject.roles.find(r => r.id === roleInput.id);
      await role.setRoleName(roleInput.roleName);
      await role.permissions.accountPermissions.setCanManageAccountSettings(roleInput.permissions.accountPermissions.canManageAccountSettings);
      await role.permissions.accountPermissions.setCanManageRolesAndPermissions(roleInput.permissions.accountPermissions.canManageRolesAndPermissions);
      await role.permissions.listingPermissions.setCanManageListings(roleInput.permissions.listingPermissions.canManageListings);
      result = (new AccountConverter()).toMongo(await repo.save(domainObject));
    });
    return result;
  }

  async accountAddRole(roleInput: RoleAddInput): Promise<Account> {
    ensureAccountPortalUser(this.context);
    let result : Account;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.getByHandle(roleInput.accountHandle); 
      const role = await domainObject.requestAddRole(roleInput.roleName);
      await role.permissions.accountPermissions.setCanManageAccountSettings(roleInput.permissions.accountPermissions.canManageAccountSettings);
      await role.permissions.accountPermissions.setCanManageRolesAndPermissions(roleInput.permissions.accountPermissions.canManageRolesAndPermissions);
      await role.permissions.listingPermissions.setCanManageListings(roleInput.permissions.listingPermissions.canManageListings);
      result = (new AccountConverter()).toMongo(await repo.save(domainObject));
    });
    return result;
  }
}