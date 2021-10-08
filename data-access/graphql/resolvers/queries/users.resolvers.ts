import { Resolvers } from '../../generated';
import { CacheScope } from 'apollo-server-types';

const users : Resolvers = {
  Query: {
    users : async (parent, args, context, info) => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public }); //this works, but doesn't work when setting it with a directive 
      console.log(`Resolver>Query>users`)
      return context.dataSources.userAPI.getUsers();
    }
  }  
}
export default users;