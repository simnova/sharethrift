import { CosmosDBType} from './data-sources/cosmos-db';

export type Context = {
  VerifedUser: {
    VerifiedJWT: any;
    OpenIdConfigKey: string;
  };
  dataSources: CosmosDBType;
}