import { isValidObjectId } from 'mongoose';
import {  Resolvers, Account, Contact, User} from '../../generated';
import user from './user.resolvers';

const account : Resolvers = {
  Account:{
    


  },
  Contact:{
    user: async (parent, args, context, info) => {
      var user: User
      if(isValidObjectId(parent.user.toString())){
        return (await context.dataSources.userAPI.getUser(parent.user.toString())) as User ;
      }
      return parent.user;
    },
    role: async (parent, args, context, info) => {
      if(isValidObjectId(parent.role.toString())){
        var account = (await context.dataSources.accountAPI.getAccount(context.executionContext.accountId)) as Account ;
        var role = account.roles.find(x => x.id === parent.role.toString());
        return role;
      }
      return null
    }
  },
  
  Query: {    
    account: async (parent, args, context, info) => {
      if(isValidObjectId(args.id)){
        var account = (await context.dataSources.accountAPI.getAccount(args.id)) as Account ;
        //does user have an account with this id?
        var currentUser = (await context.dataSources.userAPI.getByExternalId(context.VerifiedUser.VerifiedJWT.sub)) as User
        if(account && account.contacts.some(c => c.user.id.toString() === currentUser.id.toString())){ //note that user in  this case hasn't loaded the reference
          return account;
        }
      }
      return null;
    },
    accountGetByHandle: async (parent, args, context, info) => {
      if(args.handle){
        var account = (await context.dataSources.accountAPI.getAccountByHandle(args.handle)) as Account ;
        //does user have an account with this id?
        var currentUser = (await context.dataSources.userAPI.getByExternalId(context.VerifiedUser.VerifiedJWT.sub)) as User
        if(account && account.contacts.some(c => c.user.toString() === currentUser.id.toString())){ //note that user in  this case hasn't loaded the reference as it in another collection
          context.executionContext.accountId = account.id; //put acount id in execution context so it can be used in resolvers
          return account;
        }
      }
      return null;
    },
    accounts : async (parent, args, context, info) => {
      console.log(`Resolver>Query>accounts`)
      return (await context.dataSources.accountAPI.getAccounts()) as Account[];
    }
  },
  Mutation:{
    updateAccount: async (parent, args, context, info) => {
      console.log(`Resolver>Mutation>updateAccount ${args.input.id}`)
      return (await context.dataSources.accountDomainAPI.updateAccount(args.input)) as Account;
    }
  }
};
export default account;