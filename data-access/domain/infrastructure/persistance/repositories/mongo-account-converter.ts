import { Account as AccountDO } from "../../../contexts/account/account";
import { Account } from "../../../../infrastructure/data-sources/cosmos-db/models/account";
import { TypeConverter } from "../../../shared/type-converter";
import { AccountDomainAdapter } from "../adapters/account-domain-adapter";

export class AccountConverter implements TypeConverter<Account, AccountDO<AccountDomainAdapter>> {
  toDomain(mongoType: Account): AccountDO<AccountDomainAdapter> {
    if (!mongoType) {
      return null;
    }
    return new AccountDO(new AccountDomainAdapter(mongoType))
  }
  toMongo(domainType: AccountDO<AccountDomainAdapter>): Account {
    return domainType.props.props;
  }
}