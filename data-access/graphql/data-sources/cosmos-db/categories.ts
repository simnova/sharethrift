import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as Category from '../../../shared/data-sources/cosmos-db/models/category';
import {Context} from '../../context';

export default class Categories extends MongoDataSource<Category.Category, Context> {
  async getCategories(): Promise<Category.Category[]> {
    return this.model
      .find({})
      .exec();
  }
}