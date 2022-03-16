import { Resolvers, Listing, Account, Category, CreateListingPayload, DraftAuthHeaderForDraftPhotoOutput, DraftRemovePhotoResult} from '../../generated';
import { CacheScope } from 'apollo-server-types';
import mongoose, { isValidObjectId } from 'mongoose';
import { BlobStorage } from '../../../infrastructure/services/blob-storage';
import { CognativeSearch } from '../../../infrastructure/services/cognative-search';

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
      if(!parent.primaryCategory ){
        return null;
      }
      console.log("Resolver>Listing>primaryCategory")
      if(isValidObjectId(parent.primaryCategory.toString())){
        console.log("Resolver>Listing>primaryCategory provided ObjectId : looking up Category")
        return (await context.dataSources.categoryAPI.getCategory(parent.primaryCategory.toString()) as Category);
      }
      console.log("Resolver>Listing>primaryCategory provided Category Object : returning Category Object")
      console.log("Resolver>Listing>owner provided Category Object : returning Category Object", JSON.stringify(parent.primaryCategory??""));
      return parent.primaryCategory;
    }

    
     
  },
  Draft: {
    primaryCategory : async (parent, args, context, info)  => {
      console.log('Resolver>Draft>primaryCategory')
      if(!parent.primaryCategory ){
        return null;
      }
      console.log("Resolver>Listing>primaryCategory")
      if(isValidObjectId(parent.primaryCategory.toString())){
        console.log("Resolver>Listing>primaryCategory provided ObjectId : looking up Category")
        return (await context.dataSources.categoryAPI.getCategory(parent.primaryCategory.toString()) as Category);
      }
      console.log("Resolver>Listing>primaryCategory provided Category Object : returning Category Object")
      console.log("Resolver>Listing>owner provided Category Object : returning Category Object", JSON.stringify(parent.primaryCategory??""));
      return parent.primaryCategory;
    }
  },
  Query: {    

    listing : async (parent, args, context, info)  => {
//      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log(`Resolver>Query>listing ${args.id}`)
      return (await context.dataSources.listingAPI.getListing(args.id)) as Listing;
    },
  
    listings : async (parent, args, context, info) => {
      console.log(`Resolver>Query>listings`)
      return (await context.dataSources.listingAPI.getListings()) as Listing[];
    },

    listingsForAccount : async (parent, args, context, info) => {
      return (await context.dataSources.listingAPI.getListingsForAccount(args.accountId)) as Listing[];
    },
    listingSearch : async (parent, args, context, info) => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      const searchService = new CognativeSearch();
      const searchResults = await searchService.search('listings', '*');
    
      console.log(`Resolver>Query>listingSearch ${JSON.stringify(searchResults)}`);
      var idList:string[] =[]
      for await (const result of searchResults.results) {
        console.log(result);
        idList.push(result.document['id']);
      }
      //var pageOne = await searchResults.results.byPage[0];
      //console.log(`Resolver>Query>listingSearch ${JSON.stringify(pageOne)}`);
      //var idList = pageOne.map(r => r['id']);
      var results = await context.dataSources.listingAPI.getListingsByIds(idList);  //.getListingsFromSearchResults(searchResults);
//      console.log(`Resolver>Query>listingSearch ${JSON.stringify(results)}`);
      return results as Listing[];
    },
    listingsByAccountHandle : async (parent, args, context, info) => {
      var result: Listing[] = [];
      try {
        result = (await context.dataSources.listingAPI.getListingsByAccountHandle(args.handle)) as Listing[];
        
      } catch (error) {
        console.log(error);
        
      }
      console.log(`Resolver>Query>listingsByAccountHandle ${args.handle}`)
      return result
    }

  },
  Mutation: {  
    createNewListing: async (parent, args, context, info) => {
      var newListing = (await context.dataSources.listingDomainAPI.addNewListing(args.input)) as Listing ;
      return  {listing: newListing} as CreateListingPayload;
    },
    updateDraft: async (parent, args, context, info) => {
      return (await context.dataSources.listingDomainAPI.updateDraft(args.input)) as Listing ;
    },
    draftAddPhoto: async (parent, args, context, info) => {
      //TODO: Move blob logic to service
      const maxSizeMb = .5;
      const maxSizeBytes = maxSizeMb * 1024 * 1024;
      const permittedContentTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
      ];
      if (!permittedContentTypes.includes(args.input.contentType)) {
        return {success:false, errorMessage:'Content type not permitted.'} as DraftAuthHeaderForDraftPhotoOutput;
      }
      if (args.input.contentLength > maxSizeBytes) {
        return {success:false, errorMessage:'Content length exceeds permitted limit.'} as DraftAuthHeaderForDraftPhotoOutput;
      }
      var blobName = (await context.dataSources.listingDomainAPI.draftAddPhoto(args.input));
      var requestDate = new Date().toUTCString();
      var authHeader = new BlobStorage().generateSharedKey(blobName, args.input.contentLength, requestDate ,args.input.contentType);
      return {isAuthorized:true, authHeader:authHeader, requestDate:requestDate, blobName:blobName} as DraftAuthHeaderForDraftPhotoOutput;
    },
    draftRemovePhoto: async (parent, args, context, info) => {
      try {
        await context.dataSources.listingDomainAPI.draftRemovePhoto(args.input);
        return {success:true} as DraftRemovePhotoResult;
      } catch (error) {
        return {success:false, errorMessage:error.message} as DraftRemovePhotoResult;
      }
    },

    publishDraft: async (parent, args, context, info) => {
      return (await context.dataSources.listingDomainAPI.publishDraft(args.id)) as Listing;
    }
  }   
}
export default listing;