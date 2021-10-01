import { Listing as ListingDO } from "../../contexts/listing";
import { Listing, ListingModel } from "../../../infrastructure/data-sources/cosmos-db/models/listing";
import { User } from "../../../infrastructure/data-sources/cosmos-db/models/user";
import { TypeConverter } from "../../shared/infrasctructure/mongo-repository";
import { isValidObjectId } from "mongoose";
import { UserConverter } from "./UserConverter";
import { PhotoConverter } from "./PhotoConverter";


export class ListingConverter implements TypeConverter<Listing, ListingDO> {
  private userConverter = new UserConverter();
  private photoConverter = new PhotoConverter();
  toDomain(mongoType: Listing): ListingDO {
    return new ListingDO({
      id: mongoType.id,
      owner: isValidObjectId(mongoType.owner) ? null : this.userConverter.toDomain(mongoType.owner as User),
      title: mongoType.title,
      description: mongoType.description,
      primaryCategory: mongoType.primaryCategory,
      photos: mongoType.photos?.map(photo => this.photoConverter.toDomain(photo)),
      location: mongoType.location
    });
  }
  toMongo(domainType: ListingDO): Listing {
    return new ListingModel({
      id: domainType.id,
      owner: this.userConverter.toMongo(domainType.owner),
      title: domainType.title,
      description: domainType.description,
      primaryCategory: domainType.primaryCategory,
      photos:   domainType.photos?.filter(photo => photo.isMarkedForDeletion === false).map(photo => this.photoConverter.toMongo(photo)),
      location: null //domainType.location
    });
  }
}
