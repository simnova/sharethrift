import { Resolvers, User } from '../../generated';
import { CacheScope } from 'apollo-server-types';
import { nanoid } from 'nanoid';
import { BlobStorage } from '../../../infrastructure/services/blob-storage';
import { UserCreateAuthHeaderForProfilePhotoOutput } from '../../generated'

const user : Resolvers = {
  Query: {      
    user : async (parent, args, context, info)  => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Private }); 
      if(context.VerifiedUser){
        console.log(`user found in context with JWT: ${JSON.stringify(context.VerifiedUser.VerifiedJWT)}`)
      }
    //  info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public });
      console.log(`Resolver>Query>user ${args.id}`)
      return (await context.dataSources.userAPI.getUser(args.id)) as User;
    },
    currentUser : async (parent, args, context, info)  => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Private }); 
      if(context.VerifiedUser){
        console.log(`user found in context with JWT: ${JSON.stringify(context.VerifiedUser.VerifiedJWT)}`)
      }else
      {
        console.log(`user not found in context`)
        return undefined;
      }
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Private });
      var userDTO: User;
      try {
        userDTO = (await context.dataSources.userDomainAPI.addUser()) as User;
      } catch (error) {
        console.log(`Error getting/creating user: ${error}`)
      }
      
      return userDTO;
    },
    users : async (parent, args, context, info) => {
      info.cacheControl.setCacheHint({ maxAge: 60,scope: CacheScope.Public }); //this works, but doesn't work when setting it with a directive 
      console.log(`Resolver>Query>users`)
      console.log(`Context VerifiedUser value: ${JSON.stringify(context.VerifiedUser)}`)
      return (await context.dataSources.userAPI.getUsers()) as User[];
    }
  },
  Mutation: {
    createUser: async (parent, args, context, info) => {
      return (await context.dataSources.userDomainAPI.addUser()) as User;
    },
    updateUser: async (parent, args, context, info) => {
      return (await context.dataSources.userDomainAPI.updateUser(args.input)) as User;
    },
    userCreateAuthHeaderForProfilePhoto: async (parent, args, context, info) => {
      const maxSizeMb = 10;
      const maxSizeBytes = maxSizeMb * 1024 * 1024;
      const permittedContentTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
      ];
      if (!permittedContentTypes.includes(args.input.contentType)) {
        return {success:false, errorMessage:'Content type not permitted.'} as UserCreateAuthHeaderForProfilePhotoOutput;
      }
      if (args.input.contentLength > maxSizeBytes) {
        return {success:false, errorMessage:'Content length exceeds permitted limit.'} as UserCreateAuthHeaderForProfilePhotoOutput;
      }
      var currentUser =  (await context.dataSources.userAPI.getByExternalId(context.VerifiedUser.VerifiedJWT.sub)) as User;
      var blobName = currentUser.id; // nanoid();
      var requestDate = new Date().toUTCString();
      var authHeader = new BlobStorage().generateSharedKey(blobName, args.input.contentLength, requestDate ,args.input.contentType);
      return {isAuthorized:true, authHeader:authHeader, requestDate:requestDate, blobName:blobName} as UserCreateAuthHeaderForProfilePhotoOutput;
    }
  }  
}
export default user;