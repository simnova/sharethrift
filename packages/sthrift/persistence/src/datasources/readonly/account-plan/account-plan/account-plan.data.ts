import type { Models } from '@sthrift/data-sources-mongoose-models';
import {
	type MongoDataSource,
	MongoDataSourceImpl,
} from '../../mongo-data-source.ts';

export interface AccountPlanDataSource
	extends MongoDataSource<Models.AccountPlan.AccountPlan> {}
export class AccountPlanDataSourceImpl
	extends MongoDataSourceImpl<Models.AccountPlan.AccountPlan>
	implements AccountPlanDataSource {}
