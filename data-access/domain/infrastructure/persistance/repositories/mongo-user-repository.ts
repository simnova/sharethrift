import { User as UserDO, UserProps } from '../../../../domain/contexts/user/user';
import { UserRepository } from '../../../contexts/user/user-repository';
import { User, UserModel }from '../../../../infrastructure/data-sources/cosmos-db/models/user';
import { MongoRepositoryBase } from '../mongo-repository';
import { TypeConverter } from '../../../shared/type-converter';
import { ClientSession } from 'mongoose';
import { EventBus } from '../../../shared/event-bus';

export class MongoUserRepository<PropType extends UserProps> extends MongoRepositoryBase<User,PropType,UserDO<PropType>> implements UserRepository<PropType> {
  constructor(
    eventBus: EventBus,
    modelType: typeof UserModel, 
    typeConverter: TypeConverter<User, UserDO<PropType>,PropType>,
    session: ClientSession
  ) {
    super(eventBus,modelType,typeConverter,session);
  }
  
  async getByExternalId(externalId: string): Promise<UserDO<PropType>> {
    let user = await this.model.findOne({ externalId: externalId }).exec();
    return this.typeConverter.toDomain(user);
  }

  getNewInstance(externalId:string, firstName:string, lastName:string): UserDO<PropType> {
    let adapter = this.typeConverter.toAdapter(new this.model());
    return UserDO.getNewUser(adapter, externalId, firstName, lastName);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}