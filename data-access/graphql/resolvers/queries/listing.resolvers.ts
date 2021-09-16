import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/listing';
import { CacheScope } from 'apollo-server-types';

const listing : Resolvers = {
  Query: {      
    listing : async (parent, args, context, info)  => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log(`Resolver>Query>listing ${args.id}`)
      return ConvertDtoToGraph(await context.dataSources.listingAPI.getListing(args.id));
    }
  }
};
export default listing;