import { AccountPermissions, Account } from '../account/account';
import { User } from '../user/user';
import { Visa } from './passport';

export class AccountVisaImpl<root extends Account<any>> implements AccountVisa {
  constructor(private root: root,  private user: User<any>) {
  }  
  async determineIf(func:((permissions:AccountPermissions) => boolean)) :  Promise<boolean> {
    var contact = (await this.root.contacts()).find(c => c.id === this.user.id);
    var accountPermissions =  contact.role.permissions.accountPermissions;
    return func(accountPermissions);
  }
}

export interface AccountVisa extends Visa {
  determineIf(func:((permissions:AccountPermissions) => boolean)) :  Promise<boolean> ;
}