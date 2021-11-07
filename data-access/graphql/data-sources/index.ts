import { CosmosDB, CosmosDBType } from "./cosmos-db";
import {Domain, DomainType} from "./domain";

export const DataSources = {
  ...CosmosDB,
  ...Domain,
}

export type DataSourcesType = CosmosDBType & DomainType;
