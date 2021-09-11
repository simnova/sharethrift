import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/user';

export const users : Resolvers = {
  Query: {
    users : async (parent, args, context, info) => {
      return  (await context.dataSources.userAPI.getUsers()).map(ConvertDtoToGraph);
    }
  }  
}