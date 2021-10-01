import { Listing as ListingDO } from "../../contexts/listing";
import { ListingRepository } from "../../contexts/listing-repository";
import {Listing, ListingModel}from "../../../infrastructure/data-sources/cosmos-db/models/listing";
import { MongoRepository,TypeConverter } from "../../shared/infrasctructure/mongo-repository";

export class MongoListingRepository extends MongoRepository<Listing,ListingDO> implements ListingRepository {
  constructor(
    modelType: typeof ListingModel, 
    typeConverter: TypeConverter<Listing, ListingDO>

  ) {
    super(modelType,typeConverter);
  }
  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}