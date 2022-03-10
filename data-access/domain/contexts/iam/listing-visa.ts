import { ListingPermissions, ListingEntityReference } from '../listing/listing';
import { UserEntityReference } from '../user/user';
import { Visa } from './passport';

export class ListingVisaImpl<root extends ListingEntityReference> implements ListingVisa{
  constructor(private root: root, private user: UserEntityReference) {
  }

  async determineIf (func:((permissions:ListingPermissions) => boolean)) :  Promise<boolean> {
    let account = await this.root.account();
    let contact = (await account.contacts()).find(c => c.user.id === this.user.id);
    console.log('contact for listingVista found', JSON.stringify(contact));
    let roleId = contact.roleId
    let permissions =  account.roles.find((role) => role.id === roleId ).permissions.listingPermissions;
    console.log('contact\'s listing permissions found', JSON.stringify(permissions));
    return func(permissions);
  }
}

export interface ListingVisa extends Visa{
  determineIf(func:((permissions:ListingPermissions) => boolean)) :  Promise<boolean> ;
}