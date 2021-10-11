import { User as UserDO, UserProps } from "../../../contexts/user";
import { UserRepository } from "../../../contexts/user-repository";
import { User, UserModel }from "../../../../infrastructure/data-sources/cosmos-db/models/user";
import { MongoRepository } from "../mongo-repository";
import { TypeConverter } from "../../../shared/type-converter";
import { ClientSession } from "mongoose";
import { EventBus } from "../../../shared/event-bus";
export class MongoUserRepository<PropType extends UserProps> extends MongoRepository<User,PropType,UserDO<PropType>> implements UserRepository<PropType> {
  constructor(
    eventBus: EventBus,
    modelType: typeof UserModel, 
    typeConverter: TypeConverter<User, UserDO<PropType>>,
    session: ClientSession
  ) {
    super(eventBus,modelType,typeConverter,session);
  }

  getNewInstance(): UserDO<PropType> {
    return this.typeConverter.toDomain(new UserModel());
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}