import * as User from '../../../shared/data-sources/cosmos-db/models/user';
import * as Category from '../../../shared/data-sources/cosmos-db/models/category';
import Users from './users';
import Categories from './categories';

export interface ICosmosDbDataSource {
  userAPI: Users;
  categoryAPI: Categories;
}

export const CosmosDB : ICosmosDbDataSource = {
  userAPI: new Users(User.UserModel.collection),
  categoryAPI: new Categories(Category.CategoryModel.collection)
}