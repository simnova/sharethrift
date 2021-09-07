import { Resolvers } from '../../generated';

export const getCategories : Resolvers = {
  Query: {
    getCategories : async (parent, args, context, info) => {
      return await context.dataSources.categoryAPI.getCategories();
    }
  }  
}