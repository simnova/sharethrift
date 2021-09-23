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
    //  info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log(`Resolver>Query>user ${args.id}`)
      return ConvertDtoToGraph(await context.dataSources.userAPI.getUser(args.id)) as UserType;
    }
  },
   
}
export default user;