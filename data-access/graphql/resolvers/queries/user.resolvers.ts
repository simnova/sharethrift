import { isListType } from 'graphql';
import { isValidObjectId, ObjectId } from 'mongoose';
import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/user';
import { UserType } from '../types/User';

const user : Resolvers = {
  Query: {      
    user : async (parent, args, context, info)  => {
      console.log(`Resolver>Query>user ${args.id}`)
      return ConvertDtoToGraph(await context.dataSources.userAPI.getUser(args.id)) as UserType;
    }
  },
  Listing: {
    owner: async (parent, args, context, info) => {
      console.log("Resolver>Listing>owner")
      if(isValidObjectId(parent.owner)){
        console.log("Resolver>Listing>owner provided ObjectId : looking up User")
        return ConvertDtoToGraph(await context.dataSources.userAPI.getUser(parent.owner.toString())) as UserType;
      }
      else {
        console.log("Resolver>Listing>owner provided User Object : returning User Object")
        return parent.owner as UserType;
      }
    }
  }  
}
export default user;