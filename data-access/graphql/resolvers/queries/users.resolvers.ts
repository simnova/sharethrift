import { Resolvers } from '../../generated';
import { ConvertDtoToGraph } from '../mappings/user';
import { UserType } from '../types/user';


const users : Resolvers = {
  Query: {
    users : async (parent, args, context, info) => {
      console.log(`Resolver>Query>users`)
      return  (await context.dataSources.userAPI.getUsers()).map(ConvertDtoToGraph) as UserType[];
    }
  }  
}
export default users;