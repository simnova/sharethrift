import { Resolvers } from '../../generated';
import { UserType } from '../types/user';

const createUser : Resolvers = {
  Mutation: {
    createUser: async (parent, args, context, info) => {
      return context.dataSources.userDomainAPI.addUser(args.input);
    }
  }  
}
export default createUser;