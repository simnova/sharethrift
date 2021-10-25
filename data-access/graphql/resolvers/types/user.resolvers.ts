import { Resolvers } from '../../generated';
import { CacheScope } from 'apollo-server-types';


const user : Resolvers = {
  Query: {      
    user : async (parent, args, context, info)  => {
      if(context.VerifedUser){
        console.log(`user found in context with JWT: ${JSON.stringify(context.VerifedUser.VerifiedJWT)}`)
      }
    //  info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log(`Resolver>Query>user ${args.id}`)
      return context.dataSources.userAPI.getUser(args.id);
    },
    users : async (parent, args, context, info) => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public }); //this works, but doesn't work when setting it with a directive 
      console.log(`Resolver>Query>users`)
      return context.dataSources.userAPI.getUsers();
    }
  },
  Mutation: {
    createUser: async (parent, args, context, info) => {
      return context.dataSources.userDomainAPI.addUser();
    },
    updateUser: async (parent, args, context, info) => {
      return context.dataSources.userDomainAPI.updateUser(args.input);
    }
  }  
}
export default user;