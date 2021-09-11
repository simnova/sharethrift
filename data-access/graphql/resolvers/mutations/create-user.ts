import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/user';

export const createUser : Resolvers = {
  Mutation: {
    createUser: async (parent, args, context, info) => {
      return ConvertDtoToGraph(await context.dataSources.userAPI.createUser(args.input.firstName, args.input.lastName, args.input.email));
    }
  }  
}