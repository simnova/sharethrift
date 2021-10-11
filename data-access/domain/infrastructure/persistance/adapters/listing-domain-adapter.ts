import { ListingProps } from "../../../contexts/listing";
import { Listing } from "../../../../infrastructure/data-sources/cosmos-db/models/listing";
import { User } from "../../../../infrastructure/data-sources/cosmos-db/models/user";
import { LocationProps } from "../../../contexts/location";
import { PhotoProps } from "../../../contexts/photo";
import { UserProps } from "../../../contexts/user";
import { CategoryProps } from "../../../contexts/category";
import { isValidObjectId, Schema } from "mongoose";
import { UserDomainAdapter } from "./user-domain-adapter";
import { MongooseDomainAdapater } from "../mongo-domain-adapter";
import { PhotoDomainAdapter } from "./photo-domain-adapter";
import { CategoryDomainAdapter } from "./category-domain-adapter";
import { LocationDomainAdapter } from "./location-domain-adapter";
import { Types,ObjectId } from "mongoose";

export class ListingDomainAdapter extends MongooseDomainAdapater<Listing> implements ListingProps {
  constructor(props: Listing) { super(props); }

  get title(): string {return this.props.title;}
  set title(value: string) {this.props.title = value;}

  get description(): string {return this.props.description;}
  set description(value: string) {this.props.description = value;}
  
  get version(): number {return this.props.version;}
  set version(value: number) {this.props.version = value;}

  get owner(): UserProps {
    if (!this.props.owner || !isValidObjectId(this.props.owner.toString())) {
      return undefined;
    }
    return new UserDomainAdapter(this.props.owner as User);
  }
  set owner(value: UserProps) {
    if (value) {
      this.props.owner =  Types.ObjectId(value.id) as Schema.Types.ObjectId ;
    }
  }
  
  
  get photos(): PhotoProps[] {
    
    return this.props.photos.map((photo) => new PhotoDomainAdapter(photo));
  }

  get location(): LocationProps { return new LocationDomainAdapter(this.props.location); }
  get primaryCategory(): CategoryProps { return new CategoryDomainAdapter(this.props.primaryCategory); }
  set primaryCategory(value: CategoryProps) {
    if (value) {
      this.props.primaryCategory =Types.ObjectId(value.id) as Schema.Types.ObjectId ;
    }
  }
}