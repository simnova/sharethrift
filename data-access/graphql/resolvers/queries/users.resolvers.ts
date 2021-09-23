import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/user';
import { UserType } from '../types/user';
import { CacheScope } from 'apollo-server-types';

const users : Resolvers = {
  Query: {
    users : async (parent, args, context, info) => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public }); //this works, but doesn't work when setting it with a directive 
      console.log(`Resolver>Query>users`)
      return  (await context.dataSources.userAPI.getUsers()).map(ConvertDtoToGraph) as UserType[];
    }
  }  
}
export default users;