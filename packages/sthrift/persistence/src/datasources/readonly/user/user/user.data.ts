import type { Models } from '@sthrift/data-sources-mongoose-models';
import {
  type MongoDataSource,
  MongoDataSourceImpl,
} from '../../mongo-data-source.ts';

export interface UserDataSource extends MongoDataSource<Models.User.User> {}
export class UserDataSourceImpl
  extends MongoDataSourceImpl<Models.User.User>
  implements UserDataSource {}
