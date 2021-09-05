import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as Category from '../../../shared/data-sources/cosmos-db/models/category';
import {Context} from '../../context';

export default class Categories extends MongoDataSource<Category.CategoryType, Context> {
  getCategories(): Promise<Category.CategoryType[]> {
    return this.collection.find({}).toArray();
  }
}