import { Resolvers } from '../../generated';

export const getUser : Resolvers = {
  Query: {      
    getUser : async (parent, args, context, info)  => {
      return await context.dataSources.userAPI.getUser(args.id);
    }
  }  
};