import { CosmosDBType} from './data-sources/cosmos-db';
import { DomainType } from './data-sources/domain';

export type Context = {
  VerifedUser: {
    VerifiedJWT: any;
    OpenIdConfigKey: string;
  };
  dataSources: CosmosDBType & DomainType;
}