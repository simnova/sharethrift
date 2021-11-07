import { Resolvers, Category } from '../../generated';

const categories : Resolvers = {
  Query: {
    category : async (parent, args, context, info)  => {
      console.log("Resolver>Query>category")
      return (await context.dataSources.categoryAPI.getCategory(args.id) as Category);
    },
    categories : async (parent, args, context, info) => {
      console.log(`Resolver>Query>categories`)
      return (await context.dataSources.categoryAPI.getCategories()) as Category[];
    }
  },
  Mutation: {  
    createCategory: async (parent, args, context, info) => {
      return (await context.dataSources.categoryDomainAPI.addCategory(args.category)) as Category;
    },
    updateCategory: async (parent, args, context, info) => {
      return (await context.dataSources.categoryDomainAPI.updateCategory(args.category)) as Category;
    }
  } 
}

export default categories;