import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/listing';

const createListing : Resolvers = {
  Mutation: {  
    createListing: async (parent, args, context, info) => {
      return ConvertDtoToGraph(await context.dataSources.listingAPI.createListing(args.listing));
    }
  }  
}
export default createListing;