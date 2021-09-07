import { Resolvers } from '../../generated';

export const UpdateUser : Resolvers = {
  Mutation: {
    updateUser: (parent, args, context, info) => {
      return context.dataSources.userAPI.updateUser(args.input.id, args.input.firstName, args.input.lastName, args.input.email);
    }
  }  
}