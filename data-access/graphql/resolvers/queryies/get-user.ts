import { Resolvers } from '../../generated';
import {parseFields} from 'graphql-mongo-fields';

export const getUser : Resolvers = {

    
  Query: {
    getUser: (parent, args, context, info) => {
      let result = context.dataSources.userAPI.getUser(args.id);
      return result;
    }
  }  
}