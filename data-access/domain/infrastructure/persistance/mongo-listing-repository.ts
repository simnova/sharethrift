import { Listing as ListingDO } from "../../contexts/listing";
import { ListingRepository } from "../../contexts/listing-repository";
import {Listing, ListingModel}from "../../../infrastructure/data-sources/cosmos-db/models/listing";
import { MongoRepository,TypeConverter } from "../../shared/infrasctructure/mongo-repository";
import { basename } from "path/posix";

export class MongoListingRepository extends MongoRepository<Listing,ListingDO> implements ListingRepository {
  constructor(
    listingModel: typeof ListingModel, 
    typeConverter: TypeConverter<Listing, ListingDO>

  ) {
    super(listingModel,typeConverter);
  }



}


