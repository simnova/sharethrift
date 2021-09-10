import { Resolvers } from '../../generated';

export const getUsers : Resolvers = {
  Query: {
    getUsers : async (parent, args, context, info) => {
      return  await context.dataSources.userAPI.getUsers();
    }
  }  
}