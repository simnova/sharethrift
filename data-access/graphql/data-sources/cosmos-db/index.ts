import { UserModel } from '../../../infrastructure/data-sources/cosmos-db/models/user';
import { CategoryModel } from '../../../infrastructure/data-sources/cosmos-db/models/category';
import { ListingModel } from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import { AccountModel } from '../../../infrastructure/data-sources/cosmos-db/models/account';

import Users from './users';
import Categories from './categories';
import Listings from './listings';
import Accounts from './accounts';

export const CosmosDB  = {
  userAPI: new Users(UserModel),
  categoryAPI: new Categories(CategoryModel),
  listingAPI: new Listings(ListingModel),
  accountAPI: new Accounts(AccountModel),
}

export type CosmosDBType = typeof CosmosDB;