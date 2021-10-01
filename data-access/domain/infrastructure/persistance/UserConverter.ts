import { User as UserDO } from "../../contexts/user";
import { User, UserModel } from "../../../infrastructure/data-sources/cosmos-db/models/user";
import { TypeConverter } from "../../shared/infrasctructure/mongo-repository";


export class UserConverter implements TypeConverter<User, UserDO> {
  toDomain(mongoType: User): UserDO {
    return {
      id: mongoType.id,
      firstName: mongoType.firstName,
      lastName: mongoType.lastName,
      email: mongoType.email,
      schemaVersion: mongoType.schemaVersion,
      createdAt: mongoType.createdAt,
      updatedAt: mongoType.updatedAt
    };
  }
  toMongo(domainType: UserDO): User {
    return new UserModel({
      id: domainType.id,
      firstName: domainType.firstName,
      lastName: domainType.lastName,
      email: domainType.email
    });
  }
}
