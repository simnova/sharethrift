import { Listing as ListingDO, ListingProps } from "../../../contexts/listing/listing";
import { ListingRepository } from "../../../contexts/listing/listing-repository";
import { Listing, ListingModel }from "../../../../infrastructure/data-sources/cosmos-db/models/listing";
import { MongoRepositoryBase } from "../mongo-repository";
import { TypeConverter } from "../../../shared/type-converter";
import { ClientSession } from "mongoose";
import { EventBus } from "../../../shared/event-bus";
import { MongoUserRepository } from "./mongo-user-repository";
import { Passport } from "../../../contexts/iam/passport";
import { AccountEntityReference } from "../../../contexts/account/account";

export class MongoListingRepository<PropType extends ListingProps> extends MongoRepositoryBase<Listing,PropType,ListingDO<PropType>> implements ListingRepository<PropType> {
  constructor(
    eventBus: EventBus,
    modelType: typeof ListingModel, 
    typeConverter: TypeConverter<Listing, ListingDO<PropType>, PropType>,
    session: ClientSession
  ) {
    super(eventBus, modelType,typeConverter,session);
  }

  async getNewInstance(account:AccountEntityReference, passport:Passport): Promise<ListingDO<PropType>> {
    var newListing = this.typeConverter.toAdapter(new ListingModel());
    return ListingDO.getNewListing(newListing, account, passport);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}