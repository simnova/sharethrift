import { ICosmosDbDataSource} from './data-sources/cosmos-db';

export type Context = {
  authToken: string;
  dataSources: ICosmosDbDataSource;
}