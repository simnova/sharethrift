import { Account as AccountDO, AccountProps } from "../../../contexts/account/account";
import { AccountRepository } from "../../../contexts/account/account-repository";
import { Account, AccountModel }from "../../../../infrastructure/data-sources/cosmos-db/models/account";
import { MongoRepositoryBase } from "../mongo-repository";
import { TypeConverter } from "../../../shared/type-converter";
import { AnyKeys, ClientSession } from "mongoose";
import { EventBus } from "../../../shared/event-bus";

export class MongoAccountRepository<PropType extends AccountProps> extends MongoRepositoryBase<Account,PropType,AccountDO<PropType>> implements AccountRepository<PropType> {
  constructor(
    eventBus: EventBus,
    modelType: typeof AccountModel, 
    typeConverter: TypeConverter<Account, AccountDO<PropType>>,
    session: ClientSession
  ) {
    super(eventBus,modelType,typeConverter,session);
  }
  
  async getByUserId(userId: string): Promise<AccountDO<PropType>[]> {
    var accounts = await this.model.find({ "contacts.user.id": userId }).exec();
    return accounts.map((account) => this.typeConverter.toDomain(account));
  }

  getNewInstance(userId: string): AccountDO<PropType> {
    var newAccountProps: AnyKeys<Account> = {
      name: userId,
      contacts: [{
        firstName: userId,
        user: userId
      }],
    }
    var newAccountDoc = new AccountModel(newAccountProps);
    console.log(`getNewInstance:newAccountDOc=${JSON.stringify(newAccountDoc)}`);
    return this.typeConverter.toDomain(newAccountDoc);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}