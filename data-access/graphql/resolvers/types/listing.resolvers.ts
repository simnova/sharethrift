import { Resolvers, Listing, Account, Category, CreateListingPayload} from '../../generated';
import { CacheScope } from 'apollo-server-types';
import { isValidObjectId } from 'mongoose';

const listing : Resolvers = {
  Listing: {

    account: async (parent, args, context, info) => {
    //  info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log("Resolver>Listing>owner")
     
      if(parent.account && isValidObjectId(parent.account.toString())){
        console.log("Resolver>Listing>account provided ObjectId : looking up Account")
        return (await context.dataSources.accountAPI.getAccount(parent.account.toString())) as Account;
      }
      console.log("Resolver>Listing>account provided Account Object : returning Account Object")
      return parent.account;
    },
    primaryCategory : async (parent, args, context, info)  => {
      console.log("Resolver>Listing>primaryCategory")
      if(isValidObjectId(parent.primaryCategory.toString())){
        console.log("Resolver>Listing>primaryCategory provided ObjectId : looking up Category")
        return (await context.dataSources.categoryAPI.getCategory(parent.primaryCategory.toString()) as Category);
      }
      console.log("Resolver>Listing>owner provided Category Object : returning Category Object", JSON.stringify(parent.primaryCategory));
      return parent.primaryCategory;
    }
     
  },
  Query: {    

    listing : async (parent, args, context, info)  => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log(`Resolver>Query>listing ${args.id}`)
      return (await context.dataSources.listingAPI.getListing(args.id)) as Listing;
    },
  
    listings : async (parent, args, context, info) => {
      console.log(`Resolver>Query>listings`)
      return (await context.dataSources.listingAPI.getListings()) as Listing[];
    }

  },
  Mutation: {  

    createListing: async (parent, args, context, info) => {
      var newListing = (await context.dataSources.listingDomainAPI.addListing(args.input)) as Listing ;
      return  {listing: newListing} as CreateListingPayload;
    }

  }   
}
export default listing;