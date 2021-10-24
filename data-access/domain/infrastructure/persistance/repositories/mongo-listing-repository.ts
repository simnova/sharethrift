import { Listing as ListingDO, ListingProps } from "../../../contexts/listing/listing";
import { ListingRepository } from "../../../contexts/listing/listing-repository";
import { Listing, ListingModel }from "../../../../infrastructure/data-sources/cosmos-db/models/listing";
import { MongoRepositoryBase } from "../mongo-repository";
import { TypeConverter } from "../../../shared/type-converter";
import { ClientSession } from "mongoose";
import { EventBus } from "../../../shared/event-bus";

export class MongoListingRepository<PropType extends ListingProps> extends MongoRepositoryBase<Listing,PropType,ListingDO<PropType>> implements ListingRepository<PropType> {
  constructor(
    eventBus: EventBus,
    modelType: typeof ListingModel, 
    typeConverter: TypeConverter<Listing, ListingDO<PropType>>,
    session: ClientSession
  ) {
    super(eventBus, modelType,typeConverter,session);
  }

  getNewInstance(): ListingDO<PropType> {
    var newListing = new ListingModel();
    newListing.id = "";
    return this.typeConverter.toDomain(newListing);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}