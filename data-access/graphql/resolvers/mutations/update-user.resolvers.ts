import { Resolvers } from '../../generated';

const updateUser : Resolvers = {
  Mutation: {
    updateUser: async (parent, args, context, info) => {
      return context.dataSources.userDomainAPI.updateUser(args.input);
    }
  }  
}
export default updateUser;