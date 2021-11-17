import { Listing as ListingDO, ListingProps } from "../../../contexts/listing/listing";
import { Listing ,ListingModel, ListingDraft, ListingStatus } from "../../../../infrastructure/data-sources/cosmos-db/models/listing";
import { Account } from "../../../../infrastructure/data-sources/cosmos-db/models/account";
import { LocationProps } from "../../../contexts/listing/location";
import { Photo as PhotoDO, PhotoProps } from "../../../contexts/listing/photo";
import { UserProps } from "../../../contexts/user/user";
import { Account as AccountDO, AccountProps, AccountEntityReference } from "../../../contexts/account/account";
import { CategoryProps } from "../../../contexts/listing/category";
import mongoose from "mongoose";
import { MongooseDomainAdapater, MongoosePropArray } from "../mongo-domain-adapter";
import { PhotoDomainAdapter } from "./photo-domain-adapter";
import { CategoryDomainAdapter } from "./category-domain-adapter";
import { LocationDomainAdapter } from "./location-domain-adapter";
import { AccountDomainAdapter } from "./account-domain-adapter";

import { MongoTypeConverter } from "../mongo-type-converter";
import {  DraftProps } from "../../../contexts/listing/draft";
import { DraftStatus as DraftStatusDO, DraftStatusProps } from "../../../contexts/listing/draft-status";
import { Entity, EntityProps } from "../../../shared/entity";

export class ListingConverter extends MongoTypeConverter<Listing,ListingDomainAdapter,ListingDO<ListingDomainAdapter>> {
  constructor() {
    super(ListingDomainAdapter, ListingDO);
  }
}

class DraftStatusDomainAdapter implements DraftStatusProps {
  constructor(public readonly props: ListingStatus) { }

  get id(): string {return this.props.id}
  set id(value: string) {this.props.id = value}

  get statusCode(): string {return this.props.statusCode};
  set statusCode(value: string) {this.props.statusCode = value};

  get statusDetail(): string {return this.props.statusDetail};
  set statusDetail(value: string) {this.props.statusDetail = value};

  get createdAt(): Date {return this.props.createdAt};
  set createdAt(value: Date) {this.props.createdAt = value};
}



class DraftDomainAdapter implements DraftProps {
  constructor(public readonly props: ListingDraft) {}
  public get id(): string { return this.props.id.valueOf() as string; }
    
  get title(): string {return this.props.title;}
  set title(value: string) {this.props.title = value;}

  get description(): string {return this.props.description;}
  set description(value: string) {this.props.description = value;}

  public statusHistory = new MongoosePropArray(this.props.statusHistory, DraftStatusDomainAdapter);
  public photos = new MongoosePropArray(this.props.photos, PhotoDomainAdapter);

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


export class ListingDomainAdapter extends MongooseDomainAdapater<Listing> implements ListingProps {
  constructor(props: Listing) { super(props); }
  
  public usersCurrentPublishedListingQuantity = async () => {
    if(!this.props.account){ 
      return 0;
    }
    let accountId:string;
    if(!mongoose.isValidObjectId(this.props.account.toString())){
      accountId = this.props.account.toString();
    }else{  
      accountId = ((this.props.account) as Account).id;
    }
    return ListingModel.countDocuments({"account.id": accountId}).exec();    
  }

  get draft(): DraftProps {
    if(!this.props.draft){ 
      return null;
    }
    return new DraftDomainAdapter(this.props.draft);
  }
  getNewDraft(): DraftProps {
    return this.props.get('draft') as DraftProps;
  }
      
  get title(): string {return this.props.title;}
  set title(value: string) {this.props.title = value;}

  get description(): string {return this.props.description;}
  set description(value: string) {this.props.description = value;}
  
  get version(): number {return this.props.version;}
  set version(value: number) {this.props.version = value;}

  async getAccount(): Promise<AccountEntityReference>{
    if (!this.props.account) {
      return undefined;
    }
    if(mongoose.isValidObjectId(this.props.account.toString())){
      await this.props.populate('account');
    }
    return (new AccountDO(new AccountDomainAdapter(this.props.account as Account)));
  }
  public async setAccount(value: AccountEntityReference):Promise<void> {
    if (value) {
      // @ts-ignore: TS2348 - ignores bug in mongoose types
      this.props.account = mongoose.Types.ObjectId(value.id);
      await this.props.populate('account');
      console.log('listing.account - postpopulate', JSON.stringify(this.props.account));
    }
  }
  
  get photos(): PhotoProps[] {
    return this.props.photos.map((photo) => new PhotoDomainAdapter(photo));
  }

   get location(): LocationProps { 
    if(!this.props.location){ 
      return null;
    }
    return new LocationDomainAdapter(this.props.location); 
  }
  get primaryCategory(): CategoryProps { 
    if(!this.props.primaryCategory){ 
      return null;
    }
    return new CategoryDomainAdapter(this.props.primaryCategory); 
  }
  set primaryCategory(value: CategoryProps) {
    if (value) {
      // @ts-ignore: TS2348 - ignores bug in mongoose types
      this.props.primaryCategory = mongoose.Types.ObjectId(value.id);
    }
  }
}