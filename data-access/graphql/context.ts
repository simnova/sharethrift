import { DataSourcesType } from './data-sources';

export type Context = {
  VerifiedUser: {
    VerifiedJWT: any;
    OpenIdConfigKey: string;
  };
  dataSources: DataSourcesType;
}