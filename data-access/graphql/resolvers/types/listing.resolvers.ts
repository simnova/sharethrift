import { Resolvers} from '../../generated';
import { CacheScope } from 'apollo-server-types';
import { isValidObjectId } from 'mongoose';
import { ListingEntityReference } from '../../../domain/contexts/listing/listing';


//import { Listing } from '../../../infrastructure/data-sources/cosmos-db/models/listing';

const listing : Resolvers = {
  Listing: {
    account: async (parent : ListingEntityReference, args, context, info) => {
    //  info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log("Resolver>Listing>owner")
     
      if(parent.account && isValidObjectId(parent.account)){
        console.log("Resolver>Listing>account provided ObjectId : looking up Account")
        return context.dataSources.accountAPI.getAccount(parent.account.toString());
      }
      else {
        console.log("Resolver>Listing>account provided Account Object : returning Account Object")
        return parent.account;
      }
    }
  },
  Query: {    

    listing : async (parent, args, context, info)  => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log(`Resolver>Query>listing ${args.id}`)
      return context.dataSources.listingAPI.getListing(args.id);
    },
  
    listings : async (parent, args, context, info) => {
      console.log(`Resolver>Query>listings`)
      return context.dataSources.listingAPI.getListings();
    }

  },
  Mutation: {  
    createListing: async (parent, args, context, info) => {
      var newListing = await context.dataSources.listingDomainAPI.addListing(args.input);
      
      return  {listing: newListing};
    
     // return {listing: ConvertDtoToGraph(await context.dataSources.listingAPI.createListing(args.input))};
    }

  }   
}
export default listing;




/*
      Option 1:
        Return full tree of listings
         Results =
          Listings:
            Listing:
              title
              description
              owner
                id
                firstName
                lastName
              primaryCategory
                id
                name
                descrio
        Get all listings and populate the owner and primaryCategory
        1 Query: gets everything in one shot - Mongo is awesome!!!
      Options 2: 
         Return space tree and let resolver handle the rest
          Step1: GET listings
           Results =
            Listings:
              Listing:
                title
                description
                ownerId
                primaryCategoryId
          Step2: GET owners
            Results =
              Owner:
              id
              firstName
              lastName
          Step3: GET categories
            Results =
            Category:
            id
            name  
            descrio 

          W/out DataLoader: 
          Get all listings = (query1)
            Select * from listings = yeilds 1500 rows
          For each listing - get owner and primaryCategory = (query1 * query2/query3) = 3000 queries
            For each listing in listings
              Select * from owners where id = listing.ownerId
              Select * from categories where id = listing.primaryCategoryId
              Add owner and primaryCategory to listing
            Next listing
          *3001 queries

          Dataloader does this to optimize things:
          Get all listings = (query1)
          Across all listings - get list of ownerIds  and look them all up (query2)
          Across all listings - get list of primaryCategoryIds and look them all up  (query3)
          Match owners and categories to listings
          * 3 queries
      */