import { User as UserDO } from "../../../contexts/user/user";
import { User } from "../../../../infrastructure/data-sources/cosmos-db/models/user";
import { TypeConverter } from "../../../shared/type-converter";
import { UserDomainAdapter } from "../adapters/user-domain-adapter";

export class UserConverter implements TypeConverter<User, UserDO<UserDomainAdapter>> {
  toDomain(mongoType: User): UserDO<UserDomainAdapter> {
    if (!mongoType) {
      return null;
    }
    return new UserDO(new UserDomainAdapter(mongoType))
  }
  toMongo(domainType: UserDO<UserDomainAdapter>): User {
    return domainType.props.props;
  }
}