import { User as UserDO, UserProps } from "../../../contexts/user/user";
import { UserRepository } from "../../../contexts/user/user-repository";
import { User, UserModel }from "../../../../infrastructure/data-sources/cosmos-db/models/user";
import { MongoRepositoryBase } from "../mongo-repository";
import { TypeConverter } from "../../../shared/type-converter";
import { AnyKeys, ClientSession } from "mongoose";
import { EventBus } from "../../../shared/event-bus";
export class MongoUserRepository<PropType extends UserProps> extends MongoRepositoryBase<User,PropType,UserDO<PropType>> implements UserRepository<PropType> {
  constructor(
    eventBus: EventBus,
    modelType: typeof UserModel, 
    typeConverter: TypeConverter<User, UserDO<PropType>>,
    session: ClientSession
  ) {
    super(eventBus,modelType,typeConverter,session);
  }
  async getByExternalId(externalId: string): Promise<UserDO<PropType>> {
    var user = await this.model.findOne({ externalId: externalId }).exec();
    return this.typeConverter.toDomain(user);
  }

  getNewInstance(externalId:string, firstName:string, lastName:string, email:string): UserDO<PropType> {
    var newUserProps: AnyKeys<User> = {
      externalId: externalId,
      firstName: firstName,
      lastName: lastName,
      email: email,
    }
    var newUserDoc = new UserModel(newUserProps);
    console.log(`getNewInstance:newUserDoc=${JSON.stringify(newUserDoc)}`);
    var domainObject = this.typeConverter.toDomain(newUserDoc);
    domainObject.MarkAsNew();
    return domainObject;
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}