import { CosmosDBType} from './data-sources/cosmos-db';

export type Context = {
  authToken: string;
  dataSources: CosmosDBType;
}