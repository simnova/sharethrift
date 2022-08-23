import { Resolvers, Listing, Account, Category, CreateListingPayload, DraftAuthHeaderForDraftPhotoOutput, DraftRemovePhotoResult ,ListingSearchResult, ListingMutationResult} from '../../generated';
import { CacheScope } from 'apollo-server-types';
import { Listing as ListingModel } from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import mongoose, { isValidObjectId } from 'mongoose';
import { BlobStorage } from '../../../infrastructure/services/blob-storage';
import { CognativeSearch } from '../../../infrastructure/services/cognative-search';
import { 
  LoadPaymentPageRes, 
  ProcessCybersourcePaymentResponse, 
  ProcessCybersourceRefundResponse,
  ProcessPaypalAuthTokenResponse
} from '../../../infrastructure/data-sources/cosmos-db/models/payment';
import axios, { AxiosRequestConfig } from "axios";


const ListingMutationResolver = async (getListing:Promise<ListingModel>): Promise<ListingMutationResult> => {
  try {
    return {
      status : { success: true },
      listing: (await getListing) as Listing
    } as ListingMutationResult;
  }
  catch(error){
    console.error("Listing > Mutation > updateDraft : ",error);
    return  {
      status : { success: false, error: JSON.stringify(error) },
      listing: null
    } as ListingMutationResult;
  }
}

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
      //var tagString = (!args.input.tags || args.input.tags.length === 0) ? "":  " AND tags:('" + args.input.tags?.join("' AND '") + "')";

//(tags/any(t: t eq 'tagOne') or tags/any(t: t eq 'tagTwo'))
//      var tagFilter = (!args.input.tags || args.input.tags.length === 0 || args.input.tags[0].trim().length === 0 ) ? undefined:  "tags/all(t: search.in(t, '" + args.input.tags?.join(", ") + "'))";
      var tagFilter = (!args.input.tags || args.input.tags.length === 0 || args.input.tags[0].trim().length === 0 ) ? undefined:  "tags/any(t: t eq '" + args.input.tags?.join("') and tags/any(t: t eq '") + "')";

console.log(`Resolver>Query>listingSearch ${args.input.tags?.length}`)
      try {
        console.log(`Resolver>Query>listingSearch ${args.input.searchString} ${tagFilter??''}`)
        const searchResults = await searchService.search(
          'listings', 
          args.input.searchString.trim() + '*',// + tagString,
          {
            queryType:"full", //needed for lucene style search
            searchMode:"all",
            filter: tagFilter,
            facets:[
              "tags",
              "primaryCategory"
            ],
        });
        //queryType : full => search all fields (lucene)
      
        console.log(`Resolver>Query>listingSearch ${JSON.stringify(searchResults)}`);
        var idList:string[] =[]
        for await (const result of searchResults.results) {
          console.log(result);
          idList.push(result.document['id']);
        }
        //var pageOne = await searchResults.results.byPage[0];
        //console.log(`Resolver>Query>listingSearch ${JSON.stringify(pageOne)}`);
        //var idList = pageOne.map(r => r['id']);
        var results = await context.dataSources.listingAPI.getListingsByIds(idList) as Listing[];  //.getListingsFromSearchResults(searchResults);
  //      console.log(`Resolver>Query>listingSearch ${JSON.stringify(results)}`);
        //return results as Listing[];
        return {
          listingResults : results,
          facets: {
            tags: searchResults.facets.tags,
          }
        } as ListingSearchResult
      } catch (error) {
        console.error(error);
      }
        
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
      return ListingMutationResolver(context.dataSources.listingDomainAPI.addNewListing(args.input));
    },
    updateDraft: async (parent, args, context, info) => {
      return ListingMutationResolver(context.dataSources.listingDomainAPI.updateDraft(args.input));
    },
    listingDraftCreate: async (parent, args, context, info) => {
      return ListingMutationResolver(context.dataSources.listingDomainAPI.createDraft(args.id));
    },
    listingDraftPublish: async (parent, args, context, info) => {
      return ListingMutationResolver(context.dataSources.listingDomainAPI.publishDraft(args.id));
    },
    listingUnpublish: async (parent, args, context, info) => {
      return ListingMutationResolver(context.dataSources.listingDomainAPI.unpublish(args.id));
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
      var {docId,listing:returnLising} = (await context.dataSources.listingDomainAPI.draftAddPhoto(args.input));
      var requestDate = new Date().toUTCString();
      var authHeader = new BlobStorage().generateSharedKey(docId, args.input.contentLength, requestDate ,args.input.contentType);
      return {isAuthorized:true, authHeader:authHeader, requestDate:requestDate, blobName:docId, listing:returnLising} as DraftAuthHeaderForDraftPhotoOutput;
    },
    draftRemovePhoto: async (parent, args, context, info) => {
      return ListingMutationResolver(context.dataSources.listingDomainAPI.draftRemovePhoto(args.input));
    },
    loadPaymentPage: async (parent, args, context, info) => {
      var resultData;

      await axios({
        method: 'get',
        url: `https://5e67-204-142-180-9.ngrok.io/api/Cybersource/loadPaymentPage?targetOrigin=http://localhost:3000`,
        headers: {
          'origin-app-name': 'PATHWAYS',
          'origin-app-key': '2b0757a2-ef13-4aa5-ab74-d91994854253',
        }
      }).then((result: any) => {
        console.log('LIST-LOAD-PAYMENT-PAGE', result);
        resultData = result.data;
      }).catch((error: any) => {
        console.log('LIST-LOAD-PAYMENT-PAGE-ERROR', error);
        return {
          loadPaymentPageError: error
        };
      });

      return {
        keyId: resultData.keyId,
        transactionId: resultData.transactionId
      } as LoadPaymentPageRes;
    },
    getAuthToken: async (parent, args, context, info) => {
      var resultData;

      await axios({
        method: 'post',
        url: `https://5e67-204-142-180-9.ngrok.io/api/Paypal/getAuthToken`,
        data: args.processPaymentRequest,
        headers: {
          'origin-app-name': 'PATHWAYS',
          'origin-app-key': '2b0757a2-ef13-4aa5-ab74-d91994854253',
        }
      }).then((result: any) => {
        resultData = result.data;
      }).catch((error: any) => {
        return {
          getAuthTokenError: error
        };
      });

      return {
        respMsg: resultData.respMsg,
        result: resultData.result,
        secureToken: resultData.secureToken,
        secureTokenId: resultData.secureTokenId
      } as ProcessPaypalAuthTokenResponse;
    },
    processPayment: async (parent, args, context, info) => {
      var resultData;

      await axios({
        method: 'post',
        url: `https://5e67-204-142-180-9.ngrok.io/api/Cybersource/processPayment`,
        data: args.processPaymentRequest,
        headers: {
          'origin-app-name': 'PATHWAYS',
          'origin-app-key': '2b0757a2-ef13-4aa5-ab74-d91994854253',
        }
      }).then((result: any) => {
        console.log('LIST-PROCESS-PAYMENT1', result.data);
        resultData = result.data;
        console.log('LIST-PROCESS-PAYMENT2', resultData.requestId);
      }).catch((error: any) => {
        return {
          processPaymentError: error
        };
      });

      return {
        transactionId: resultData.transactionId,
        reconciliationId: resultData.reconciliationId,
        status: resultData.status,
        responseCode: resultData.responseCode,
        submittedTimeUtc: resultData.submittedTimeUtc,
        requestId: resultData.requestId
      } as ProcessCybersourcePaymentResponse;
    },
    processRefund: async (parent, args, context, info) => {
      var resultData;

      await axios({
        method: 'post',
        url: 'https://5e67-204-142-180-9.ngrok.io/api/Cybersource/processRefund',
        data: args.processRefundRequest,
        headers: {
          'origin-app-name': 'PATHWAYS',
          'origin-app-key': '2b0757a2-ef13-4aa5-ab74-d91994854253',
        }
      }).then((result: any) => {
        resultData = result.data;
      }).catch((error: any) => {
        return {
          processRefundError: error
        };
      });

      return {
        nothing: 'nothing'
      } as ProcessCybersourceRefundResponse;
    }
  }   
}
export default listing;