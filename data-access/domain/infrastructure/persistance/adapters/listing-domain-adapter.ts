import { Listing as ListingDO, ListingProps } from "../../../contexts/listing/listing";
import { Listing ,ListingModel} from "../../../../infrastructure/data-sources/cosmos-db/models/listing";
import { Account } from "../../../../infrastructure/data-sources/cosmos-db/models/account";
import { LocationProps } from "../../../contexts/listing/location";
import { PhotoProps } from "../../../contexts/listing/photo";
import { UserProps } from "../../../contexts/user/user";
import { AccountProps } from "../../../contexts/account/account";
import { CategoryProps } from "../../../contexts/listing/category";
import mongoose from "mongoose";
import { MongooseDomainAdapater } from "../mongo-domain-adapter";
import { PhotoDomainAdapter } from "./photo-domain-adapter";
import { CategoryDomainAdapter } from "./category-domain-adapter";
import { LocationDomainAdapter } from "./location-domain-adapter";
import { AccountDomainAdapter } from "./account-domain-adapter";

import { MongoTypeConverter } from "../mongo-type-converter";

export class ListingConverter extends MongoTypeConverter<Listing,ListingDomainAdapter,ListingDO<ListingDomainAdapter>> {
  constructor() {
    super(ListingDomainAdapter, ListingDO);
  }
}

export class ListingDomainAdapter extends MongooseDomainAdapater<Listing> implements ListingProps {
  constructor(props: Listing) { super(props); }
  
  public usersCurrentPublishedListingQuantity = async () => {
    if(!this.account || !this.account.id){ 
      return 0;
    }
    return ListingModel.countDocuments({"account.id": this.account.id}).exec();    
  }

  get title(): string {return this.props.title;}
  set title(value: string) {this.props.title = value;}

  get description(): string {return this.props.description;}
  set description(value: string) {this.props.description = value;}
  
  get version(): number {return this.props.version;}
  set version(value: number) {this.props.version = value;}

  get account(): AccountProps {
    if (!this.props.account || !mongoose.isValidObjectId(this.props.account.toString())) {
      return undefined;
    }
    if(mongoose.isValidObjectId(this.props.account.toString())){
//      await this.props.populate('listings.account');
      //this.props.description.
    }
    return new AccountDomainAdapter(this.props.account as Account);
  }
  set account(value: AccountProps) {
    if (value) {
      // @ts-ignore: TS2348 - ignores bug in mongoose types
      this.props.account = mongoose.Types.ObjectId(value.id);
    }
  }
  
  get photos(): PhotoProps[] {
    return this.props.photos.map((photo) => new PhotoDomainAdapter(photo));
  }

   get location(): LocationProps { 
    if(!this.props.location){ 
      return null;
    }
    console.log('listing.location - prepopulate', JSON.stringify(this.props.location));
//    (async() => { await this.props.populate('listing.location'); })();
//    console.log('listing.location - postpopulate', JSON.stringify(this.props.location));
    return new LocationDomainAdapter(this.props.location); 
  }
  get primaryCategory(): CategoryProps { 
    if(!this.props.primaryCategory){ 
      return null;
    }
    console.log('listing.primaryCategory - prepopulate', JSON.stringify(this.props.primaryCategory));
//    (async() => { await this.props.populate('listing.primaryCategory'); })();
//    console.log('listing.primaryCategory - postpopulate', JSON.stringify(this.props.primaryCategory));

    return new CategoryDomainAdapter(this.props.primaryCategory); 
  }
  set primaryCategory(value: CategoryProps) {
    if (value) {
      // @ts-ignore: TS2348 - ignores bug in mongoose types
      this.props.primaryCategory = mongoose.Types.ObjectId(value.id);
    }
  }
}