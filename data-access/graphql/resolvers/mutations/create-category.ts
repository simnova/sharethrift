import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/category';

export const createCategory : Resolvers = {
  Mutation: {  
    createCategory: async (parent, args, context, info) => {
      return ConvertDtoToGraph(await context.dataSources.categoryAPI.createCategory(args.category));
    }
  }  
}