import { ListingProps } from "../../../contexts/listing/listing";
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

export class ListingDomainAdapter extends MongooseDomainAdapater<Listing> implements ListingProps {
  constructor(props: Listing) { super(props); }
  
  public usersCurrentPublishedListingQuantity = async () => {
    if(!this.owner || !this.owner.id){ 
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
    return new AccountDomainAdapter(this.props.account as Account);
  }
  set owner(value: UserProps) {
    if (value) {
      // @ts-ignore: TS2348 - ignores bug in mongoose types
      this.props.owner = mongoose.Types.ObjectId(value.id);
    }
  }
  
  get photos(): PhotoProps[] {
    return this.props.photos.map((photo) => new PhotoDomainAdapter(photo));
  }

  get location(): LocationProps { return new LocationDomainAdapter(this.props.location); }
  get primaryCategory(): CategoryProps { return new CategoryDomainAdapter(this.props.primaryCategory); }
  set primaryCategory(value: CategoryProps) {
    if (value) {
      // @ts-ignore: TS2348 - ignores bug in mongoose types
      this.props.primaryCategory = mongoose.Types.ObjectId(value.id);
    }
  }
}