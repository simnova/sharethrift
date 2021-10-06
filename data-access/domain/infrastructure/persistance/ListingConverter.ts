import {  Listing as ListingDO, ListingProps } from "../../contexts/listing";
import { Listing } from "../../../infrastructure/data-sources/cosmos-db/models/listing";
import { User } from "../../../infrastructure/data-sources/cosmos-db/models/user";
import { TypeConverter } from "../../shared/infrasctructure/mongo-repository";
import { Location } from "../../contexts/location";
import { Photo as PhotoDO } from "../../contexts/photo";
import { User as UserDO } from "../../contexts/user";
import { Category as CategoryDO } from "../../contexts/category";
import { isValidObjectId, Document } from "mongoose";


export class ListingConverter implements TypeConverter<Document<Listing>, ListingDO<DomainAdapter>> {
  toDomain(mongoType: Listing): ListingDO<DomainAdapter> {
    return new ListingDO(new DomainAdapter(mongoType))
  }
  toMongo(domainType: ListingDO<DomainAdapter>): Listing {
    return domainType.props;
  }
}

export class DomainAdapter extends Document<Listing> implements Listing, ListingProps {
  props:Listing;
  id?:string;
  title: string;
  description: string;
  location: Location;
  photos: PhotoDO[];
  owner: any;
  primaryCategory: CategoryDO;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
  version:number;

  
  public constructor(model:Listing) {
    super(model);
    this.props = model;
    this.id = model.id;
    this.title = model.title;
    this.description = model.description;
    this.primaryCategory = model.primaryCategory;
    this.photos = undefined;
    this.owner = isValidObjectId(model.owner.toString()) ? null : new UserDO(model.owner as User);
    this.location = model.location;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this.schemaVersion = model.schemaVersion;
    this.version = model.version;
  }
}