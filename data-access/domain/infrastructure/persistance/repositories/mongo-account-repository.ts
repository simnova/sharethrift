import { Account as AccountDO, AccountProps } from '../../../contexts/account/account';
import { AccountRepository } from '../../../contexts/account/account-repository';
import { Account, AccountModel } from '../../../../infrastructure/data-sources/cosmos-db/models/account';
import { UserModel } from '../../../../infrastructure/data-sources/cosmos-db/models/user';

import { MongoRepositoryBase } from '../mongo-repository';
import { TypeConverter } from '../../../shared/type-converter';
import { ClientSession } from 'mongoose';
import { EventBus } from '../../../shared/event-bus';
import { UserConverter } from '../adapters/user-domain-adapter';

export class MongoAccountRepository<PropType extends AccountProps> extends MongoRepositoryBase<Account,PropType,AccountDO<PropType>> implements AccountRepository<PropType> {
  constructor(
    eventBus: EventBus,
    modelType: typeof AccountModel, 
    typeConverter: TypeConverter<Account, AccountDO<PropType>,PropType>,
    session: ClientSession
  ) {
    super(eventBus,modelType,typeConverter,session);
  }
  
  async getByUserId(userId: string): Promise<AccountDO<PropType>[]> {
    let accounts = await this.model.find({ 'contacts.user.id': userId }).exec();
    return accounts.map((account) => this.typeConverter.toDomain(account));
  }

  async getNewInstance(userId: string): Promise<AccountDO<PropType>> {
    let user = (new UserConverter).toDomain(await UserModel.findById(userId).exec());
    let adapter = this.typeConverter.toAdapter(new this.model());
    return AccountDO.CreateInitialAccountForNewUser(adapter,user);   
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}