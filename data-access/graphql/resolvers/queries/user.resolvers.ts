import { isListType } from 'graphql';
import { isValidObjectId, ObjectId } from 'mongoose';
import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/user';
import { UserType } from '../types/User';
import { CacheScope } from 'apollo-server-types';
import { ListingType } from '../types/listing';

const user : Resolvers = {
  Query: {      
    user : async (parent, args, context, info)  => {
      if(context.VerifedUser){
        console.log(`user found in context with JWT: ${JSON.stringify(context.VerifedUser.VerifiedJWT)}`)
      }
    //  info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log(`Resolver>Query>user ${args.id}`)
      var userDto = await context.dataSources.userAPI.findOneById(args.id)
      return ConvertDtoToGraph(userDto) as UserType;
    }
  },
   
}
export default user;