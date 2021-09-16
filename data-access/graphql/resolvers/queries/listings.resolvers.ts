import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/listing';

const listings : Resolvers = {
  Query: {
    listings : async (parent, args, context, info) => {
      console.log(`Resolver>Query>listings`)
      return (await context.dataSources.listingAPI.getListings()).map(ConvertDtoToGraph);
    }
  }  
}
export default listings;