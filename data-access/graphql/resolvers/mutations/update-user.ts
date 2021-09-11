import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/user';

export const updateUser : Resolvers = {
  Mutation: {
    updateUser: async (parent, args, context, info) => {
      return ConvertDtoToGraph(await context.dataSources.userAPI.updateUser(args.input.id, args.input.firstName, args.input.lastName, args.input.email));
    }
  }  
}