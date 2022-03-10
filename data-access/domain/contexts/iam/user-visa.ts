import { UserEntityReference, UserPermissions } from '../user/user';
import { Visa } from './passport';

export class UserVisaImpl<root extends UserEntityReference> implements UserVisa{
  constructor(private root: root, private user: UserEntityReference) {
  }

  async determineIf (func:((permissions:UserPermissions) => boolean)) :  Promise<boolean> {
    const userIsEditingTheirAccount = this.user.id === this.root.id;
    const result:Partial<UserPermissions> ={
      canManageUser: userIsEditingTheirAccount
    };
    return func(result as UserPermissions);
  }
}

export interface UserVisa extends Visa{
  determineIf(func:((permissions:UserPermissions) => boolean)) :  Promise<boolean> ;
}