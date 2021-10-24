import {ListingPermissions, Listing, ListingProps } from "../listing/listing";
import { User } from "../user/user";
import { Visa } from "./passport";

export class ListingVisaImpl<root extends Listing<any>> implements ListingVisa{
  constructor(private root: root, private user: User<any>) {
  }

  determineIf (func:((permissions:ListingPermissions) => boolean)) :  boolean {
    var contact = this.root.account.contacts.find(c => c.id === this.user.id);
    var permissions =  contact.role.permissions.listingPermissions;
    return func(permissions);
  }
}

export interface ListingVisa extends Visa{
  determineIf(func:((permissions:ListingPermissions) => boolean)) :  boolean ;
}