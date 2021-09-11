import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/user';

export const getUsers : Resolvers = {
  Query: {
    getUsers : async (parent, args, context, info) => {
      return  (await context.dataSources.userAPI.getUsers()).map(ConvertDtoToGraph);
    }
  }  
}