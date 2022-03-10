import { AccountEntityReference } from '../account/account';
import { ListingEntityReference } from '../listing/listing';
import { UserEntityReference} from '../user/user';
import { AccountVisa, AccountVisaImpl } from './account-visa';
import { ListingVisa, ListingVisaImpl } from './listing-visa';
import { UserVisa, UserVisaImpl } from './user-visa';

export interface Visa{
  determineIf(func:((permissions) => boolean)) :  Promise<boolean> ;
}

export interface Passport {
  forAcccount(root: AccountEntityReference):  AccountVisa;
  forListing(root: ListingEntityReference):  ListingVisa;
  forUser(root: UserEntityReference):  UserVisa;
}

export class PassportImpl implements Passport {
  constructor(private readonly user: UserEntityReference){}
  forAcccount(root: AccountEntityReference):  AccountVisa {
    return new AccountVisaImpl(root,this.user);
  }
  forListing(root: ListingEntityReference):  ListingVisa {
    return new ListingVisaImpl(root,this.user);
  }    
  forUser(root: UserEntityReference):  UserVisa {
    return new UserVisaImpl(root,this.user);
  }   
}