import { Listing as ListingDO, ListingProps } from '../../../contexts/listing/listing';
import { ListingRepository } from '../../../contexts/listing/listing-repository';
import { Listing, ListingModel }from '../../../../infrastructure/data-sources/cosmos-db/models/listing';
import { MongoRepositoryBase } from '../mongo-repository';
import { TypeConverter } from '../../../shared/type-converter';
import { ClientSession } from 'mongoose';
import { EventBus } from '../../../shared/event-bus';
import { MongoUserRepository } from './mongo-user-repository';
import { Passport } from '../../../contexts/iam/passport';
import { AccountEntityReference } from '../../../contexts/account/account';
import { DomainExecutionContext } from '../../../contexts/context';

export class MongoListingRepository<PropType extends ListingProps> extends MongoRepositoryBase<DomainExecutionContext,Listing,PropType,ListingDO<PropType>> implements ListingRepository<PropType> {
  constructor(
    eventBus: EventBus,
    modelType: typeof ListingModel, 
    typeConverter: TypeConverter<Listing, ListingDO<PropType>, PropType,DomainExecutionContext>,
    session: ClientSession,
    context: DomainExecutionContext
  ) {
    super(eventBus, modelType,typeConverter,session,context);
  }

  async getNewInstance(account:AccountEntityReference): Promise<ListingDO<PropType>> {
    let newListing = this.typeConverter.toAdapter(new ListingModel());
    return ListingDO.getNewListing(newListing, account, this.context);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}