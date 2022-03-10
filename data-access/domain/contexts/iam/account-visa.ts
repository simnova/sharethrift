import { AccountPermissions, AccountEntityReference } from '../account/account';
import { UserEntityReference } from '../user/user';
import { Visa } from './passport';

export class AccountVisaImpl<root extends AccountEntityReference> implements AccountVisa {
  constructor(private root: root, private user: UserEntityReference) {
  }  
  
  async determineIf(func:((permissions:AccountPermissions) => boolean)) :  Promise<boolean> {
    const roleId = (await this.root.contacts()).find(x => x.user.id === this.user.id).roleId;
    const contactRole = this.root.roles.find((role) => role.id === roleId);
    const accountPermissions =  contactRole.permissions.accountPermissions;

    return func(accountPermissions);
  }
}

export interface AccountVisa extends Visa {
  determineIf(func:((permissions:AccountPermissions) => boolean)) :  Promise<boolean> ;
}