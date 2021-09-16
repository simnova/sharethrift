import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/category';
import { CategoryType } from '../types/category';

const createCategory : Resolvers = {
  Mutation: {  
    createCategory: async (parent, args, context, info) => {
      return ConvertDtoToGraph(await context.dataSources.categoryAPI.createCategory(args.category)) as CategoryType;
    }
  }  
}
export default createCategory;