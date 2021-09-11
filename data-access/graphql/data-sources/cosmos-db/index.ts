import { UserModel } from '../../../shared/data-sources/cosmos-db/models/user';
import { CategoryModel } from '../../../shared/data-sources/cosmos-db/models/category';
import Users from './users';
import Categories from './categories';

export const CosmosDB  = {
  userAPI: new Users(UserModel),
  categoryAPI: new Categories(CategoryModel)
}

export type CosmosDBType = typeof CosmosDB;