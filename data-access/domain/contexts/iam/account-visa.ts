import {AccountPermissions, Account } from "../account/account";
import { User } from "../user/user";
import { Visa } from "./passport";

export class AccountVisaImpl<root extends Account<any>> implements AccountVisa {
  constructor(private root: root,  private user: User<any>) {
  }  
  determineIf(func:((permissions:AccountPermissions) => boolean)) :  boolean {
    var contact = this.root.contacts.find(c => c.id === this.user.id);
    var accountPermissions =  contact.role.permissions.accountPermissions;
    return func(accountPermissions);
  }
}

export interface AccountVisa extends Visa {
  determineIf(func:((permissions:AccountPermissions) => boolean)) :  boolean ;
}