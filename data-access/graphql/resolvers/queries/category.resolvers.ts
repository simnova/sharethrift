import { isValidObjectId, ObjectId } from 'mongoose';
import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/category';
import { CategoryType } from '../types/category';

const category : Resolvers = {
  Query: {      
    category : async (parent, args, context, info)  => {
      console.log("Resolver>Query>category")
      return ConvertDtoToGraph(await context.dataSources.categoryAPI.getCategory(args.id)) as CategoryType;
    }
  },
  Listing: {  
    primaryCategory : async (parent, args, context, info)  => {
      console.log("Resolver>Listing>primaryCategory")
      if(isValidObjectId(parent.primaryCategory as ObjectId)){
        console.log("Resolver>Listing>primaryCategory provided ObjectId : looking up Category")
        return ConvertDtoToGraph(await context.dataSources.categoryAPI.getCategory(parent.primaryCategory.toString())) as CategoryType;
      }
      console.log("Resolver>Listing>owner provided Category Object : returning Category Object")
      return parent.primaryCategory as CategoryType
    }
  }  
};
export default category;