import { Account } from '../account/account';
import { Listing } from '../listing/listing';
import { User } from '../user/user';
import { AccountVisa, AccountVisaImpl } from './account-visa';
import { ListingVisa, ListingVisaImpl } from './listing-visa';

export interface Visa{
  determineIf(func:((permissions) => boolean)) :  Promise<boolean> ;
}

export interface Passport {
  forAcccount(root: Account<any>):  AccountVisa;
  forListing(root: Listing<any>):  ListingVisa;
}

export class PassportImpl implements Passport {
  constructor(private readonly user: User<any>){}
  forAcccount(root: Account<any>):  AccountVisa {
    return new AccountVisaImpl(root,this.user);
  }
  forListing(root: Listing<any>):  ListingVisa {
    return new ListingVisaImpl(root,this.user);
  }    
}