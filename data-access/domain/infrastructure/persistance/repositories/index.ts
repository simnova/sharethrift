import { NodeEventBus } from '../../events/node-event-bus';
import { InProcEventBus } from '../../events/in-proc-event-bus';
import { MongoUnitOfWork } from '../mongo-unit-of-work';

import { AccountModel } from '../../../../infrastructure/data-sources/cosmos-db/models/account';
import { AccountConverter } from '../adapters/account-domain-adapter';
import { MongoAccountRepository } from './mongo-account-repository';

import { Category, CategoryModel } from '../../../../infrastructure/data-sources/cosmos-db/models/category';
import { CategoryConverter } from '../adapters/category-domain-adapter';
import { MongoCategoryRepository } from './mongo-category-repository';

import { ListingModel } from '../../../../infrastructure/data-sources/cosmos-db/models/listing';
import { ListingConverter } from '../adapters/listing-domain-adapter';
import { MongoListingRepository } from './mongo-listing-repository';

import { UserModel } from '../../../../infrastructure/data-sources/cosmos-db/models/user';
import { UserConverter } from '../adapters/user-domain-adapter';
import { MongoUserRepository } from './mongo-user-repository';

export const CategoryUnitOfWork = new MongoUnitOfWork(InProcEventBus,NodeEventBus, CategoryModel, new CategoryConverter(), MongoCategoryRepository);
export const UserUnitOfWork = new MongoUnitOfWork(InProcEventBus,NodeEventBus, UserModel, new UserConverter(), MongoUserRepository);
export const ListingUnitOfWork = new MongoUnitOfWork(InProcEventBus,NodeEventBus, ListingModel, new ListingConverter(), MongoListingRepository);
export const AccountUnitOfWork = new MongoUnitOfWork(InProcEventBus,NodeEventBus, AccountModel, new AccountConverter(), MongoAccountRepository);