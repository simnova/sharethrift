import { Resolvers } from '../../generated';

export const updateUser : Resolvers = {
  Mutation: {
    updateUser: async (parent, args, context, info) => {
      return await context.dataSources.userAPI.updateUser(args.input.id, args.input.firstName, args.input.lastName, args.input.email);
    }
  }  
}