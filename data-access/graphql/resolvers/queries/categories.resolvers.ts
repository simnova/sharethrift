import { Resolvers } from '../../generated';

const categories : Resolvers = {
  Query: {
    categories : async (parent, args, context, info) => {
      console.log(`Resolver>Query>categories`)
      return context.dataSources.categoryAPI.getCategories();
    }
  }  
}
export default categories;