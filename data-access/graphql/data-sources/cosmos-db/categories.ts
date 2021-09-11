import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Document } from 'mongoose';
import * as Category from '../../../shared/data-sources/cosmos-db/models/category';
import {Context} from '../../context';
import {CategoryDetail} from '../../generated';

export default class Categories extends MongoDataSource<Category.Category, Context> {
  async getCategories(): Promise<Category.Category[]> {
    return this.model
      .find({})
      .exec();
  }

  createCategory(categoryDetail:CategoryDetail): Promise<Category.Category> {
    
    var category = new this.model(
      {name: categoryDetail.name,}
    );
    
    return category.save();
  }
}