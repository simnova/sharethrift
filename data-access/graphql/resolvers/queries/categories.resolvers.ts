import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/category';
import { CategoryType } from '../types/category';

const categories : Resolvers = {
  Query: {
    categories : async (parent, args, context, info) => {
      console.log(`Resolver>Query>categories`)
      return (await context.dataSources.categoryAPI.getCategories()).map(ConvertDtoToGraph) as CategoryType[];
    }
  }  
}
export default categories;