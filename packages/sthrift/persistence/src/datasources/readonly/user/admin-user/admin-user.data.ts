import type { Models } from '@sthrift/data-sources-mongoose-models';
import {
	type MongoDataSource,
	MongoDataSourceImpl,
} from '../../mongo-data-source.ts';

export interface AdminUserDataSource
	extends MongoDataSource<Models.User.AdminUser> {}
export class AdminUserDataSourceImpl
	extends MongoDataSourceImpl<Models.User.AdminUser>
	implements AdminUserDataSource {}
