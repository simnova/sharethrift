import { Resolvers } from '../../generated';

export const getCategories : Resolvers = {
  Query: {
    getCategories:  (parent, args, context, info) => {
      const categories = context.dataSources.categoryAPI.getCategories();
      return categories;
    }
  }  
}