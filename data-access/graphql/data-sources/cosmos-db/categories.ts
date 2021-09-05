import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as Category from '../../../shared/data-sources/cosmos-db/models/category';
import {Context} from '../../context';

export default class Categories extends MongoDataSource<Category.Category, Context> {
  getCategories(): Promise<Category.Category[]> {
    return this.collection.find({}).toArray();
  }
}