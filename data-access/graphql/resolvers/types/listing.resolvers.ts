import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/listing';
import { CacheScope } from 'apollo-server-types';
import { ListingType } from './listing';
import { UserType } from './user';
import { isValidObjectId } from 'mongoose';

import { ConvertDtoToGraph as UserConverter } from '../mappings/user';

const listing : Resolvers = {
  Listing: {
    owner: async (parent : ListingType, args, context, info) => {
    //  info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log("Resolver>Listing>owner")
     
      if(isValidObjectId(parent.owner)){
        console.log("Resolver>Listing>owner provided ObjectId : looking up User")
        return UserConverter(await context.dataSources.userAPI.getUser(parent.owner.toString())) as UserType;
      }
      else {
        console.log("Resolver>Listing>owner provided User Object : returning User Object")
        return parent.owner as UserType;
      }
    }
  },
  Query: {    

    listing : async (parent, args, context, info)  => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log(`Resolver>Query>listing ${args.id}`)
      return ConvertDtoToGraph(await context.dataSources.listingAPI.getListing(args.id));
    },
  
    listings : async (parent, args, context, info) => {
      console.log(`Resolver>Query>listings`)
      return (await context.dataSources.listingAPI.getListings()).map(ConvertDtoToGraph);
    }

  },
  Mutation: {  
    createListing: async (parent, args, context, info) => {
      return {listing: ConvertDtoToGraph(await context.dataSources.listingAPI.createListing(args.input))};
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