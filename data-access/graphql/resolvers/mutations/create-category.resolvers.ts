import { Resolvers } from '../../generated';

const createCategory : Resolvers = {
  Mutation: {  
    createCategory: async (parent, args, context, info) => {
      return context.dataSources.categoryDomainAPI.addCategory(args.category);
    }
  }  
}
export default createCategory;