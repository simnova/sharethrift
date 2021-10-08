import { Listing as ListingDO, ListingProps } from "../../../contexts/listing";
import { ListingRepository } from "../../../contexts/listing-repository";
import { Listing, ListingModel }from "../../../../infrastructure/data-sources/cosmos-db/models/listing";
import { MongoRepository } from "../mongo-repository";
import { TypeConverter } from "../../../shared/type-converter";
import { ClientSession } from "mongoose";
export class MongoListingRepository<PropType extends ListingProps> extends MongoRepository<Listing,PropType,ListingDO<PropType>> implements ListingRepository<PropType> {
  constructor(
    modelType: typeof ListingModel, 
    typeConverter: TypeConverter<Listing, ListingDO<PropType>>,
    session: ClientSession
  ) {
    super(modelType,typeConverter,session);
  }

  getNewInstance(): ListingDO<PropType> {
    return this.typeConverter.toDomain(new ListingModel());
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}