import { isValidObjectId, ObjectId } from 'mongoose';
import { Resolvers } from '../../generated';

const category : Resolvers = {
  Query: {      
    category : async (parent, args, context, info)  => {
      console.log("Resolver>Query>category")
      return context.dataSources.categoryAPI.getCategory(args.id);
    }
  },
  Listing: {  
    primaryCategory : async (parent, args, context, info)  => {
      console.log("Resolver>Listing>primaryCategory")
      if(isValidObjectId(parent.primaryCategory.toString())){
        console.log("Resolver>Listing>primaryCategory provided ObjectId : looking up Category")
        return context.dataSources.categoryAPI.getCategory(parent.primaryCategory.toString());
      }
      console.log("Resolver>Listing>owner provided Category Object : returning Category Object")
      return parent.primaryCategory;
    }
  }  
};
export default category;