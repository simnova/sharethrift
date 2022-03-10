import { Account as AccountDO, AccountProps } from '../../../contexts/account/account';
import { AccountRepository } from '../../../contexts/account/account-repository';
import { Account, AccountModel } from '../../../../infrastructure/data-sources/cosmos-db/models/account';
import { UserModel } from '../../../../infrastructure/data-sources/cosmos-db/models/user';

import { MongoRepositoryBase } from '../mongo-repository';
import { TypeConverter } from '../../../shared/type-converter';
import { ClientSession } from 'mongoose';
import { EventBus } from '../../../shared/event-bus';
import { UserConverter } from '../adapters/user-domain-adapter';

import { DomainExecutionContext } from '../../../contexts/context';

export class MongoAccountRepository<PropType extends AccountProps> extends MongoRepositoryBase<DomainExecutionContext,Account,PropType,AccountDO<PropType>> implements AccountRepository<PropType> {
  constructor(
    eventBus: EventBus,
    modelType: typeof AccountModel, 
    typeConverter: TypeConverter<Account, AccountDO<PropType>,PropType,DomainExecutionContext>,
    session: ClientSession,
    context: DomainExecutionContext
  ) {
    super(eventBus,modelType,typeConverter,session,context);
  }
  
  async getByUserId(userId: string): Promise<AccountDO<PropType>[]> {
    let accounts = await this.model.find({ 'contacts.user.id': userId }).exec();
    return accounts.map((account) => this.typeConverter.toDomain(account,this.context));
  }

  async getByHandle(handle: string): Promise<AccountDO<PropType>> {
    let account = await this.model.findOne({ handle: handle }).exec();
    return this.typeConverter.toDomain(account,this.context);
  }

  async getNewInstance(userId: string): Promise<AccountDO<PropType>> {
    let user = (new UserConverter).toDomain(await UserModel.findById(userId).exec(),this.context);
    let adapter = this.typeConverter.toAdapter(new this.model());
    return AccountDO.CreateInitialAccountForNewUser(adapter,user,this.context);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}