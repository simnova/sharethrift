import { Resolvers } from '../../generated';

export const createUser : Resolvers = {
  Mutation: {
    createUser: async (parent, args, context, info) => {
      return await context.dataSources.userAPI.createUser(args.input.firstName, args.input.lastName, args.input.email);
    }
  }  
}