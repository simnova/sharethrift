import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Document } from 'mongoose';
import * as Category from '../../../infrastructure/data-sources/cosmos-db/models/category';
import {Context} from '../../context';
import {CategoryDetail} from '../../generated';
import { CategoryDomainAdapter } from '../../../domain/infrastructure/persistance/adapters/category-domain-adapter';
import { CategoryEntityReference } from '../../../domain/contexts/category';

export default class Categories extends MongoDataSource<Category.Category, Context> {

  async getCategory(categoryId : string): Promise<CategoryEntityReference> {
    return new CategoryDomainAdapter(await this?.findOneById(categoryId));
  }

  async getCategories(): Promise<CategoryEntityReference[]> {
    return (await this.model
      .find({})
      .exec())
      .map(category => new CategoryDomainAdapter(category));
  }
/*
  createCategory(categoryDetail:CategoryDetail): Promise<Category.Category> {
    var category = new this.model(
      {name: categoryDetail.name,}
    );
    return category.save();
  }
*/
  
}