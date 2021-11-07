import { isValidObjectId } from 'mongoose';
import {  Resolvers, Account, Contact, User} from '../../generated';

const account : Resolvers = {
  Account:{
    
    
  },
  Contact:{
    user: async (parent, args, context, info) => {
      if(isValidObjectId(parent.user.toString())){
        return (await context.dataSources.userAPI.getUser(parent.user.id)) as User ;
      }
      return parent.user;
    }
  },
  Query: {    
    accounts : async (parent, args, context, info) => {
      console.log(`Resolver>Query>accounts`)
      return (await context.dataSources.accountAPI.getAccounts()) as Account[];
    }
  },
};



export default account;