import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/category';

export const categories : Resolvers = {
  Query: {
    categories : async (parent, args, context, info) => {
      return (await context.dataSources.categoryAPI.getCategories()).map(ConvertDtoToGraph);
    }
  }  
}