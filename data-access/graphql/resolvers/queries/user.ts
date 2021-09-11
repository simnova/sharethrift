import { UserModel } from '../../../shared/data-sources/cosmos-db/models/user';
import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/user';

export const user : Resolvers = {
  Query: {      
    user : async (parent, args, context, info)  => {
      return ConvertDtoToGraph(await context.dataSources.userAPI.getUser(args.id));
    }
  }  
};
