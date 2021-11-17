import { AccountPermissions, Account } from '../account/account';
import { User } from '../user/user';
import { Visa } from './passport';

export class AccountVisaImpl<root extends Account<any>> implements AccountVisa {
  constructor(private root: root,  private user: User<any>) {
  }  
  async determineIf(func:((permissions:AccountPermissions) => boolean)) :  Promise<boolean> {
    let contact = (await this.root.contacts()).find(c => c.id === this.user.id);
    let roleId = contact.roleId
    let contactRole = this.root.roles.find((role) => role.id === roleId );
    let accountPermissions =  contactRole.permissions.accountPermissions;
    return func(accountPermissions);
  }
}

export interface AccountVisa extends Visa {
  determineIf(func:((permissions:AccountPermissions) => boolean)) :  Promise<boolean> ;
}