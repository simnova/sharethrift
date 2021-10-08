import { Resolvers } from '../../generated';

const user : Resolvers = {
  Query: {      
    user : async (parent, args, context, info)  => {
      if(context.VerifedUser){
        console.log(`user found in context with JWT: ${JSON.stringify(context.VerifedUser.VerifiedJWT)}`)
      }
    //  info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log(`Resolver>Query>user ${args.id}`)
      return context.dataSources.userAPI.getUser(args.id);
    }
  },
   
}
export default user;