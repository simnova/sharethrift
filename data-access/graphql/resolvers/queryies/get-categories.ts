import { Resolvers } from '../../generated';
import {parseFields} from '../../../shared/util/graphql-mongo-fields';

export const getCategories : Resolvers = {
  Query: {
    getCategories:  (parent, args, context, info) => {
      const categories = context.dataSources.categoryAPI.getCategories();
      return categories;
    }
  }  
}