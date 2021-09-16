import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/user';
import { UserType } from '../types/user';

const createUser : Resolvers = {
  Mutation: {
    createUser: async (parent, args, context, info) => {
      return ConvertDtoToGraph(await context.dataSources.userAPI.createUser(args.input.firstName, args.input.lastName, args.input.email)) as UserType;
    }
  }  
}
export default createUser;