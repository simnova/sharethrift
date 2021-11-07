import { Resolvers, User } from '../../generated';
import { CacheScope } from 'apollo-server-types';


const user : Resolvers = {
  Query: {      
    user : async (parent, args, context, info)  => {
      if(context.VerifiedUser){
        console.log(`user found in context with JWT: ${JSON.stringify(context.VerifiedUser.VerifiedJWT)}`)
      }
    //  info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log(`Resolver>Query>user ${args.id}`)
      return (await context.dataSources.userAPI.getUser(args.id)) as User;
    },
    users : async (parent, args, context, info) => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public }); //this works, but doesn't work when setting it with a directive 
      console.log(`Resolver>Query>users`)
      console.log(`Context VerifiedUser value: ${JSON.stringify(context.VerifiedUser)}`)
      return (await context.dataSources.userAPI.getUsers()) as User[];
    }
  },
  Mutation: {
    createUser: async (parent, args, context, info) => {
      return (await context.dataSources.userDomainAPI.addUser()) as User;
    },
    updateUser: async (parent, args, context, info) => {
      return (await context.dataSources.userDomainAPI.updateUser(args.input)) as User;
    }
  }  
}
export default user;