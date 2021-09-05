import { Resolvers } from '../../generated';

export const getUser : Resolvers = {

    
  Query: {
    getUser: (parent, args, context, info) => {
      let result = context.dataSources.userAPI.getUser(args.id);
      return result;
    }
  }  
}