import { ListingConverter } from '../../../domain/infrastructure/persistance/repositories/mongo-listing-converter';
import { MongoListingRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-listing-repository';
import { ListingModel } from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import { CategoryConverter } from '../../../domain/infrastructure/persistance/repositories/mongo-category-converter';
import { MongoCategoryRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-category-repository';
import { CategoryModel } from '../../../infrastructure/data-sources/cosmos-db/models/category';

import { UserConverter } from '../../../domain/infrastructure/persistance/repositories/mongo-user-converter';
import { MongoUserRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-user-repository';
import { UserModel } from '../../../infrastructure/data-sources/cosmos-db/models/user';

import { MongoUnitOfWork } from '../../../domain/infrastructure/persistance/mongo-unit-of-work';
import Listings from './listings';
import Categories from './categories';
import Users from './users';

import { NodeEventBus } from '../../../domain/infrastructure/events/node-event-bus';

export const Domain  = {
  listingDomainAPI: new Listings(new MongoUnitOfWork(NodeEventBus,ListingModel, new ListingConverter(), MongoListingRepository)),
  categoryDomainAPI: new Categories(new MongoUnitOfWork(NodeEventBus,CategoryModel, new CategoryConverter(), MongoCategoryRepository)),
  userDomainAPI: new Users(new MongoUnitOfWork(NodeEventBus, UserModel, new UserConverter(), MongoUserRepository))
}

export type DomainType = typeof Domain;