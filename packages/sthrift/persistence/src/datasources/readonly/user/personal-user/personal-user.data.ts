import type { Models } from '@sthrift/data-sources-mongoose-models';
import {
	type MongoDataSource,
	MongoDataSourceImpl,
} from '../../mongo-data-source.ts';

export interface PersonalUserDataSource
	extends MongoDataSource<Models.User.PersonalUser> {}
export class PersonalUserDataSourceImpl
	extends MongoDataSourceImpl<Models.User.PersonalUser>
	implements PersonalUserDataSource {}
