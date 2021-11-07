import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Category }  from '../../../infrastructure/data-sources/cosmos-db/models/category';
import { Context } from '../../context';

export class Categories extends MongoDataSource<Category, Context> {

  async getCategory(categoryId : string): Promise<Category> {
    return  this.findOneById(categoryId);
  }
  
  async getCategories(): Promise<Category[]> {
    return this.model
      .find({})
      .exec();
  } 
   
}