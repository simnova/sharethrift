import type { Models } from '@sthrift/data-sources-mongoose-models';
import {
	type MongoDataSource,
	MongoDataSourceImpl,
} from '../../mongo-data-source.ts';

export interface PersonalUserRoleDataSource
	extends MongoDataSource<Models.Role.PersonalUserRole> {}
export class PersonalUserRoleDataSourceImpl
	extends MongoDataSourceImpl<Models.Role.PersonalUserRole>
	implements PersonalUserRoleDataSource {}
