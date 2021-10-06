import { Listing as ListingDO, ListingProps } from "../../contexts/listing";
import { ListingRepository } from "../../contexts/listing-repository";
import {Listing, ListingModel}from "../../../infrastructure/data-sources/cosmos-db/models/listing";
import { MongoRepository,TypeConverter } from "../../shared/infrasctructure/mongo-repository";
import { ClientSession } from "mongoose";
import { DomainAdapter } from "./ListingConverter";
export class MongoListingRepository<PropType extends ListingProps> extends MongoRepository<Listing,PropType,ListingDO<PropType>> implements ListingRepository<PropType> {
  constructor(
    modelType: typeof ListingModel, 
    typeConverter: TypeConverter<Listing, ListingDO<PropType>>,
    session: ClientSession
  ) {
    super(modelType,typeConverter,session);
  }
  getNewInstance(): ListingDO<PropType> {
    var listing = new ListingModel();
    var listingDA = new DomainAdapter(listing);
    return this.typeConverter.toDomain(listingDA);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}