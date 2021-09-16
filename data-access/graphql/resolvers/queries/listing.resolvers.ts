import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/listing';

const listing : Resolvers = {
  Query: {      
    listing : async (parent, args, context, info)  => {
      console.log(`Resolver>Query>listing ${args.id}`)
      return ConvertDtoToGraph(await context.dataSources.listingAPI.getListing(args.id));
    }
  }
};
export default listing;