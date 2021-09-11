import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/category';

export const getCategories : Resolvers = {
  Query: {
    getCategories : async (parent, args, context, info) => {
      return (await context.dataSources.categoryAPI.getCategories()).map(ConvertDtoToGraph);
    }
  }  
}