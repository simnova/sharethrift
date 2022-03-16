
import { ListingPermissions, ListingEntityReference, SystemPermissions, ListingPermissionDefaults } from '../listing/listing';
import { UserEntityReference } from '../user/user';
import { Visa, SystemUserId } from './passport';

export class ListingVisaImpl<root extends ListingEntityReference> implements ListingVisa{
  constructor(private root: root, private user: UserEntityReference) {
  }

  async determineIf (func:((permissions:ListingPermissions) => boolean)) :  Promise<boolean> {
    if(this.user.id === SystemUserId) { 
      console.log('===========System User');
      return true; }

    let account = await this.root.account();
    let contact = (await account.contacts()).find(c => c.user.id === this.user.id);
    if (!contact || !contact.roleId) { return false; }

    let roleId = contact.roleId
    let listingPermissions:ListingPermissions = account.roles.find((role) => role.id === roleId ).permissions.listingPermissions;
    
    let permissions = {...ListingPermissionDefaults, ...{canManageListings: listingPermissions.canManageListings} };
    console.log('===========ListingVisaImpl', JSON.stringify(permissions));
    return func(permissions);
  }
}

export interface ListingVisa extends Visa{
  determineIf(func:((permissions:ListingPermissions) => boolean)) :  Promise<boolean> ;
}