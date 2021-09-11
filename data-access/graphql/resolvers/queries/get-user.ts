import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/user';

export const getUser : Resolvers = {
  Query: {      
    getUser : async (parent, args, context, info)  => {
      return ConvertDtoToGraph(await context.dataSources.userAPI.getUser(args.id));
    }
  }  
};